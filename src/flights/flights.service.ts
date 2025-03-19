import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
  forwardRef,
  Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Flight } from './entities/flight.entity';
import { Repository } from 'typeorm';
import { AirlinesService } from 'src/airports/airlines.service';
import { AirportsService } from 'src/airports/airports.service';
import { AdminsService } from 'src/users/admins.service';
import { createFlightDto } from './dtos/create-flight.dto';
import { User } from 'src/users/entities/user.entity';
import { SeatsService } from 'src/bookings/seats.service';
import { StaffMember } from 'src/users/entities/staff-member.entity';
import { DelayFlightDto } from './dtos/delay-flight.dto';
import { UserRole } from 'src/enums/user-roles.enum';
import { StaffMemberService } from 'src/users/staff-members.service';
import { Permissions } from 'src/enums/permissions.enums';
import { FlightStatus } from 'src/enums/flight-status.enum';
import { QueueService } from 'src/queue/queue.service';
import { Booking } from 'src/bookings/entities/bookings.entity';
import { PubsubService } from 'src/pubsub/pubsub.service';
import { GetFlightsDto } from './dtos/get-flights.dto';

@Injectable()
export class FlightsService {
  constructor(
    @InjectRepository(Flight) private flightsRepository: Repository<Flight>,
    private airlineService: AirlinesService,
    private airportsService: AirportsService,
    private adminService: AdminsService,
    private seatsService: SeatsService,
    @Inject(forwardRef(() => StaffMemberService))
    private staffMembersService: StaffMemberService,
    private queueService: QueueService,
    private pubsubService: PubsubService,
  ) {}

  async createFlight(createFlightDto: createFlightDto, user: User) {
    const admin = await this.adminService.findByUser(user);
    if (!admin) throw new UnauthorizedException();
    const airline = await this.airlineService.getAirlineById(
      createFlightDto.airlineId,
    );
    if (airline.airport.id != admin.airport.id) {
      throw new UnauthorizedException();
    }
    const originAirport = await this.airportsService.getAirportById(
      createFlightDto.originAirportId,
    );
    const destinationAirport = await this.airportsService.getAirportById(
      createFlightDto.destinationAirportId,
    );

    if (
      await this.flightsRepository.exists({
        where: { flightNumber: createFlightDto.flightNumber },
      })
    ) {
      throw new BadRequestException('flight number already exist');
    }
    const flight = this.flightsRepository.create({
      flightNumber: createFlightDto.flightNumber,
      departureTime: createFlightDto.departureTime,
      arrivalTime: createFlightDto.arrivalTime,
      availableSeats: createFlightDto.availableSeats,
      airline,
      originAirport,
      destinationAirport,
    });
    await this.flightsRepository.save(flight);
    await this.seatsService.storeFlightSeats(flight);

    return flight;
  }

  async findFlightByFlightNumber(flightNumber: string) {
    const flight = await this.flightsRepository.findOne({
      where: { flightNumber },
      relations: [
        'airline',
        'airline.airport',
        'bookings',
        'bookings.passenger',
        'bookings.passenger.user',
        'originAirport',
        'destinationAirport',
      ],
    });
    if (!flight) throw new BadRequestException('flight does not exist');
    return flight;
  }
  async bookSeat(flight: Flight) {
    flight.availableSeats--;
    await this.flightsRepository.save(flight);
  }

  async staffMemberIsAssignedToFlight(
    staffMember: StaffMember,
    flight: Flight,
  ) {
    return this.flightsRepository.exists({
      where: {
        id: flight.id,
        staffMembers: {
          id: staffMember.id,
        },
      },
    });
  }

  private async IsAuthorizedToManageFlights(
    user: User,
    flight: Flight,
  ): Promise<Boolean> {
    let authorized = false;
    if (user.role === UserRole.SUPER_ADMIN) {
      authorized = true;
    } else if (user.role === UserRole.ADMIN) {
      const admin = await this.adminService.findByUser(user);
      if (!admin) throw new UnauthorizedException();
      authorized = flight.airline.airport.id === admin?.airport.id;
    } else if (user.role === UserRole.STAFF_MEMBER) {
      const staffMember =
        await this.staffMembersService.getStaffMemberByUser(user);

      if (!staffMember) throw new UnauthorizedException();
      for (const perm of staffMember?.role.staffPermissions) {
        if (perm.permission === Permissions.MANAGE_BOOKING_STATUS) {
          authorized = true;
          break;
        }
        authorized &&= await this.staffMemberIsAssignedToFlight(
          staffMember,
          flight,
        );
      }
    }
    return authorized;
  }

  async delayFlight(delayFlightDto: DelayFlightDto, user: User) {
    const flight = await this.findFlightByFlightNumber(
      delayFlightDto.flightNumber,
    );
    if (flight.status === FlightStatus.CANCELLED)
      throw new BadRequestException('flight is cancelled');

    if (!(await this.IsAuthorizedToManageFlights(user, flight))) {
      throw new UnauthorizedException();
    }
    if (
      flight.departureTime.getTime() >= delayFlightDto.departureTime.getTime()
    ) {
      throw new BadRequestException(
        "the departure date should be more than or equal the flight's departure date",
      );
    }
    const delayDuration =
      delayFlightDto.departureTime.getTime() - flight.departureTime.getTime();

    const partialFlight = {
      id: flight.id,
      departureTime: delayFlightDto.departureTime,
      arrivalTime: new Date(flight.arrivalTime.getTime() + delayDuration),
      status: FlightStatus.DELAYED,
    };

    await this.flightsRepository.save(partialFlight);

    const updatedFlight = await this.findFlightByFlightNumber(
      delayFlightDto.flightNumber,
    );

    this.pubsubService.updateFlight(updatedFlight);
    updatedFlight.bookings.forEach((booking: Booking) => {
      this.queueService.delayFlight(
        updatedFlight.flightNumber,
        booking.passenger.user.email,
        updatedFlight.departureTime,
      );
    });

    return updatedFlight;
  }

  async cancelFlight(flightNumber: string, user: User) {
    const flight = await this.findFlightByFlightNumber(flightNumber);
    if (flight.status === FlightStatus.CANCELLED)
      throw new BadRequestException('flight is cancelled');

    if (!(await this.IsAuthorizedToManageFlights(user, flight))) {
      throw new UnauthorizedException();
    }

    const partialFlight = {
      id: flight.id,
      status: FlightStatus.CANCELLED,
    };

    await this.flightsRepository.save(partialFlight);

    const updatedFlight = await this.findFlightByFlightNumber(flightNumber);

    updatedFlight.bookings.forEach((booking: Booking) => {
      this.queueService.cancelFlight(
        updatedFlight.flightNumber,
        booking.passenger.user.email,
      );
    });

    this.pubsubService.updateFlight(updatedFlight);
    return updatedFlight;
  }

  async getManyFlights(getFlightsDto: GetFlightsDto) {
    if (getFlightsDto.flightNumber) {
      return [this.findFlightByFlightNumber(getFlightsDto.flightNumber)];
    }
    let query = this.flightsRepository
      .createQueryBuilder('flight')
      .select('flight.*');

    if (getFlightsDto.airlineId) {
      query.andWhere('flight.airlineId = :airlineId', {
        airlineId: getFlightsDto.airlineId,
      });
    }

    if (getFlightsDto.departureTime) {
      query.andWhere('flight.departureTime >= :departureTime', {
        departureTime: new Date(getFlightsDto.departureTime),
      });
    }

    if (getFlightsDto.destinationAirportId) {
      query.andWhere('flight.destinationAirportId = :destinationAirportId', {
        destinationAirportId: getFlightsDto.destinationAirportId,
      });
    }

    if (getFlightsDto.originAirportId) {
      query.andWhere('flight.originAirportId = :originAirportId', {
        originAirportId: getFlightsDto.originAirportId,
      });
    }

    const flights = await query
      .limit(10)
      .offset((getFlightsDto.page - 1) * 10)
      .getRawMany();

    flights.forEach((flight) => {
      flight.status = parseInt(flight.status);
    });
    return flights;
  }
}
