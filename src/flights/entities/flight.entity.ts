import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { Airline } from 'src/airports/entities/airline.entity';
import { Airport } from 'src/airports/entities/airport.entity';
import { Booking } from 'src/bookings/entities/bookings.entity';
import { Seat } from 'src/bookings/entities/seats.entity';
import { FlightStatus } from 'src/enums/flight-status.enum';
import { Interval } from 'src/graphql/interval.model';
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
@ObjectType()
export class Flight {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @Column({ unique: true })
  @Field()
  flightNumber: string;

  @Column({ type: 'timestamp' })
  @Field()
  departureTime: Date;

  @Column({ type: 'timestamp' })
  @Field()
  arrivalTime: Date;

  @Column({
    type: 'enum',
    enum: FlightStatus,
    default: FlightStatus.ON_TIME,
  })
  @Field(() => FlightStatus)
  status: FlightStatus;

  @Column({
    type: 'interval',
    generatedType: 'STORED',
    asExpression: `"arrivalTime" - "departureTime"`,
  })
  @Field(() => Interval)
  duration: string;

  @Column()
  @Field(() => Int)
  availableSeats: number;

  @ManyToOne(() => Airline, (airline) => airline.flights)
  @Field(() => Airline)
  airline: Airline;

  @ManyToOne(() => Airport, (airport) => airport.originFlights)
  @Field(() => Airport)
  originAirport: Airport;

  @ManyToOne(() => Airport, (airport) => airport.destinationFlights)
  @Field(() => Airport)
  destinationAirport: Airport;

  @ManyToMany(() => StaffMember, (staffMember) => staffMember.assignedFlights)
  staffMembers!: StaffMember[];
  @OneToMany(() => Seat, (seat) => seat.flight)
  seats: Seat[];

  @OneToMany(() => Booking, (booking) => booking.flight)
  bookings: Booking[];

  airlineId: number;
  destinationAirportId: number;
  originAirportId: number;
}
