import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  OneToOne,
} from 'typeorm';
import { Airline } from './airline.entity';
import { Flight } from 'src/flights/entities/flight.entity';
import { Admin } from 'src/users/entities/admin.entity';

@Entity()
export class Airport {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column()
  city: string;

  @Column()
  country: string;

  @OneToMany(() => Airline, (airline) => airline.airport)
  airlines: Airline[];

  @OneToMany(() => Flight, (flight) => flight.originAirport)
  originFlights: Flight[];

  @OneToMany(() => Flight, (flight) => flight.destinationAirport)
  destinationFlights: Flight[];

  @OneToOne(() => Admin, (admin) => admin.airport)
  admin: Admin;
}
