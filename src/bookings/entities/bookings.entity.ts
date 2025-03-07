import { BookingStatus } from 'src/enums/booking-status.enum';
import { Flight } from 'src/flights/entities/flight.entity';
import { Passenger } from 'src/users/entities/passenger.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Seat } from './seats.entity';

@Entity()
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: BookingStatus, default: BookingStatus.PENDING })
  status: BookingStatus;

  @ManyToOne(() => Flight, (flight) => flight.bookings)
  flight: Flight;

  @ManyToOne(() => Passenger, (passenger) => passenger.bookings)
  passenger: Passenger;

  @OneToOne(() => Seat)
  @JoinColumn()
  seat: Seat;
}
