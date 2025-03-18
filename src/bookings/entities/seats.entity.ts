import { Flight } from 'src/flights/entities/flight.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Booking } from './bookings.entity';
import { Field, Int, ObjectType } from '@nestjs/graphql';

@Entity()
@ObjectType()
@Unique(['seatNumber', 'flight'])
export class Seat {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column({ default: true })
  @Field()
  available: boolean;

  @Column()
  @Field()
  seatNumber: string;

  @ManyToOne(() => Flight, (flight) => flight.seats, { onDelete: 'CASCADE' })
  flight: Flight;

  @OneToOne(() => Booking, (booking) => booking.seat)
  booking!: Booking;
}
