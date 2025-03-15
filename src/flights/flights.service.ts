import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Flight } from './entities/flight.entity';
import { Repository } from 'typeorm';
import { AirlinesService } from 'src/airports/airlines.service';
import { AirportsService } from 'src/airports/airports.service';
import { AdminsService } from 'src/users/admins.service';
import { createFlightDto } from './dtos/create-flight.dto';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class FlightsService {
  constructor(
    @InjectRepository(Flight) private flightsRepository: Repository<Flight>,
    private airlineService: AirlinesService,
    private airportsService: AirportsService,
    private adminService: AdminsService,
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

    return this.flightsRepository.save(flight);
  }

  async findFlightByFlightNumber(flightNumber: string) {
    const flight = await this.flightsRepository.findOne({
      where: { flightNumber },
      relations: ['airline', 'airline.airport'],
    });
    if (!flight) throw new BadRequestException('flight does not exist');
    return flight;
  }
}
