import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Airport } from './airport.entity';
import { Flight } from 'src/flights/entities/flight.entity';

@Entity()
export class Airline {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @ManyToOne(() => Airport, (airport) => airport.airlines)
  airport: Airport;

  @OneToMany(() => Flight, (flight) => flight.airline)
  flights: Flight[];
}
