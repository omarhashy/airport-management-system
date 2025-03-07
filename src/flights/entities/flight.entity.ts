import { Airline } from 'src/airports/entities/airline.entity';
import { Airport } from 'src/airports/entities/airport.entity';
import { Booking } from 'src/bookings/entities/bookings.entity';
import { Seat } from 'src/bookings/entities/seats.entity';
import { FlightStatus } from 'src/enums/flight-status.enum';
import { StaffMember } from 'src/users/entities/staff-member.entity';
import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Flight {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  flightNumber: number;

  @Column({ type: 'timestamp' })
  departureTime: Date;

  @Column({ type: 'timestamp' })
  arrivalTime: Date;

  @Column({ type: 'enum', enum: FlightStatus, default: FlightStatus.ON_TIME })
  status: FlightStatus;

  @Column({ type: 'interval' })
  duration: string;

  @Column()
  availableSeats: number;

  @ManyToOne(() => Airline, (airline) => airline.flights)
  airline: Airline;

  @ManyToOne(() => Airport, (airport) => airport.originFlights)
  originAirport: Airport;

  @ManyToOne(() => Airport, (airport) => airport.destinationFlights)
  destinationAirport: Airport;

  @ManyToMany(() => StaffMember, (staffMember) => staffMember.assignedFlights)
  staffMembers!: StaffMember[];

  @OneToMany(() => Seat, (seat) => seat.flight)
  seats: Seat[];

  @OneToMany(() => Booking, (booking) => booking.flight)
  bookings: Booking[];
}
