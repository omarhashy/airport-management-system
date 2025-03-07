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

@Entity()
export class Seat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: true })
  available: boolean;

  @ManyToOne(() => Flight, (flight) => flight.seats)
  flight: Flight;

  @OneToOne(() => Booking, (booking) => booking.seat)
  passenger!: Passenger;
}
