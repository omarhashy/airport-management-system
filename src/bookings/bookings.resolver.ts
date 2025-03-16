import {
  Args,
  Int,
  Mutation,
  Parent,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { BookingsService } from './bookings.service';
import { Booking } from './entities/bookings.entity';
import { UseGuards } from '@nestjs/common';
import { IsLoggedIn } from 'src/guards/is-logged-in.guard';
import { Role } from 'src/decorators/role.decorator';
import { UserRole } from 'src/enums/user-roles.enum';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { Seat } from './entities/seats.entity';
import { SeatsService } from './seats.service';
import { BookingStatus } from 'src/enums/booking-status.enum';

@Resolver(() => Booking)
export class BookingsResolver {
  constructor(
    private readonly bookingsService: BookingsService,
    private readonly seatsService: SeatsService,
  ) {}

  @Mutation(() => Booking)
  @UseGuards(IsLoggedIn)
  @Role(UserRole.PASSENGER)
  bookFlight(
    @Args('flightNumber') flightNumber: string,
    @CurrentUser() user: User,
  ) {
    return this.bookingsService.bookFlight(flightNumber, user);
  }

  @Mutation(() => Booking)
  @UseGuards(IsLoggedIn)
  @Role([UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.STAFF_MEMBER])
  manageBooking(
    @Args('bookingId', { type: () => Int }) id: number,
    @Args('bookingStatus', { type: () => BookingStatus }) bookingStatus,
    @CurrentUser() user: User,
  ) {
    return this.bookingsService.mangeBooking(id, bookingStatus, user);
  }

  @ResolveField('seat', () => Seat)
  getSeat(@Parent() booking: Booking) {
    if(booking.seat) return booking.seat
    return this.seatsService.getSeat(booking);
  }
}
