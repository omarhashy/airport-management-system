import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Seat } from 'src/bookings/entities/seats.entity';
import { BookingStatus } from 'src/enums/booking-status.enum';
import { Flight } from 'src/flights/entities/flight.entity';
import { Passenger } from 'src/users/entities/passenger.entity';

@ObjectType()
export class BookingModel {
  @Field(() => Int)
  id: number;

  @Field()
  status: BookingStatus;

  @Field(() => Flight)
  flight: Flight;

  passenger: Passenger;

  @Field(() => Seat)
  seat: Seat;
}
