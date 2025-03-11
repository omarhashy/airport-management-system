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
import { StaffMember } from 'src/users/entities/staff-member.entity';
import { Field, ObjectType } from '@nestjs/graphql';

@Entity()
@ObjectType()
export class Airport {
  @PrimaryGeneratedColumn()
  @Field()
  id: number;

  @Column({ unique: true })
  @Field()
  name: string;

  @Column()
  @Field()
  city: string;

  @Column()
  @Field()
  country: string;

  @OneToMany(() => Airline, (airline) => airline.airport)
  airlines: Airline[];

  @OneToMany(() => Flight, (flight) => flight.originAirport)
  originFlights: Flight[];

  @OneToMany(() => Flight, (flight) => flight.destinationAirport)
  destinationFlights: Flight[];

  @OneToOne(() => Admin, (admin) => admin.airport)
  admin: Admin;

  @OneToMany(() => StaffMember, (staffMember) => staffMember.airport)
  staffMembers: StaffMember[];
}
