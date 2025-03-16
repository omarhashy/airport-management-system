import { Flight } from 'src/flights/entities/flight.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Booking } from './bookings.entity';
import { Passenger } from 'src/users/entities/passenger.entity';
import { Field, ObjectType } from '@nestjs/graphql';

@Entity()
@ObjectType()
export class Seat {
  @PrimaryGeneratedColumn()
  @Field()
  id: number;

  @Column({ default: true })
  @Field()
  available: boolean;

  @Column({ unique: true })
  @Field()
  seatNumber: string;

  @ManyToOne(() => Flight, (flight) => flight.seats)
  flight: Flight;

  @OneToOne(() => Booking, (booking) => booking.seat)
  booking!: Booking;
}
