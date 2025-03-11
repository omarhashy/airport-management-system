import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Airport } from './airport.entity';
import { Flight } from 'src/flights/entities/flight.entity';
import { Field, ObjectType } from '@nestjs/graphql';

@Entity()
@ObjectType()
export class Airline {
  @PrimaryGeneratedColumn()
  @Field()
  id: number;

  @Column({ unique: true })
  @Field()
  name: string;

  @ManyToOne(() => Airport, (airport) => airport.airlines, { nullable: false })
  @Field(() => Airport)
  airport: Airport;

  @OneToMany(() => Flight, (flight) => flight.airline)
  flights: Flight[];
}
