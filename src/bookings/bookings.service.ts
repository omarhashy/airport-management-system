import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { Booking } from './entities/bookings.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SeatsService } from './seats.service';
import { FlightsService } from 'src/flights/flights.service';
import { PassengersService } from 'src/users/passengers.service';
import { User } from 'src/users/entities/user.entity';
import { BookingStatus } from 'src/enums/booking-status.enum';
import { UserRole } from 'src/enums/user-roles.enum';
import { AdminsService } from 'src/users/admins.service';
import { StaffMemberService } from 'src/users/staff-members.service';
import { Permissions } from 'src/enums/permissions.enums';
import { QueueService } from 'src/queue/queue.service';
import { UsersService } from 'src/users/users.service';
import { FlightStatus } from 'src/enums/flight-status.enum';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking) private bookingRepository: Repository<Booking>,
    private seatsService: SeatsService,
    private flightsService: FlightsService,
    private passengerService: PassengersService,
    private adminService: AdminsService,
    private staffMembersService: StaffMemberService,
    private queueService: QueueService,
    private usersService: UsersService,
  ) {}

  async bookFlight(flightNumber: string, user: User) {
    const passenger = await this.passengerService.getPassengerByUser(user);
    if (!passenger)
      throw new BadRequestException('passenger data does not exist');

    const flight =
      await this.flightsService.findFlightByFlightNumber(flightNumber);
    if (flight.availableSeats == 0)
      throw new BadRequestException('All seats are booked');
    if (
      await this.bookingRepository.exists({
        where: {
          flight,
          passenger,
        },
        relations: ['seat'],
      })
    ) {
      throw new BadRequestException('user already booked a flight');
    }

    const seat = await this.seatsService.bookSeat(flight);
    if (!seat) throw new BadRequestException('No seats available');
    else await this.flightsService.bookSeat(flight);

    const booking = this.bookingRepository.create({
      flight,
      seat,
      passenger,
    });
    return this.bookingRepository.save(booking);
  }

  async mangeBooking(id: number, bookingStatus: BookingStatus, user: User) {
    const booking = await this.bookingRepository.findOne({
      where: {
        id,
      },
      relations: [
        'flight',
        'flight.airline',
        'flight.airline.airport',
        'seat',
        'passenger',
      ],
    });

    if (!booking) throw new BadRequestException('booking does not exist');
    if (
      booking.status === bookingStatus ||
      booking.status === BookingStatus.CANCELLED
    )
      throw new BadRequestException(
        'booking status is canceled or booking.status = bookingStatus',
      );
    if (booking.flight.status === FlightStatus.CANCELLED)
      throw new BadRequestException('flight is cancelled');

    let authorized = false;
    if (user.role === UserRole.SUPER_ADMIN) {
      authorized = true;
    } else if (user.role === UserRole.ADMIN) {
      const admin = await this.adminService.findByUser(user);
      if (!admin) throw new UnauthorizedException();
      authorized = booking.flight.airline.airport.id === admin?.airport.id;
    } else if (user.role === UserRole.STAFF_MEMBER) {
      const staffMember =
        await this.staffMembersService.getStaffMemberByUser(user);

      if (!staffMember) throw new UnauthorizedException();
      for (const perm of staffMember?.role.staffPermissions) {
        if (perm.permission === Permissions.MANAGE_BOOKING_STATUS) {
          authorized = true;
          break;
        }
      }
      authorized &&= await this.flightsService.staffMemberIsAssignedToFlight(
        staffMember,
        booking.flight,
      );
    }
    if (!authorized) {
      throw new UnauthorizedException();
    }

    booking.status = bookingStatus;
    if (booking.status === BookingStatus.CANCELLED)
      booking.seat.available = true;

    const passengerUser = await this.usersService.findUserByPassenger(
      booking.passenger,
    );

    if (!passengerUser?.email) {
      throw new InternalServerErrorException();
    }

    this.queueService.manageBookingEmail(
      booking.flight.flightNumber,
      passengerUser.email,
      bookingStatus,
    );
    return this.bookingRepository.save(booking);
  }
}
