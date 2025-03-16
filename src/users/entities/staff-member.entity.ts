import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
  ManyToOne,
} from 'typeorm';
import { User } from './user.entity';
import { Flight } from 'src/flights/entities/flight.entity';
import { StaffRole } from 'src/auth/entities/staff-role.entity';
import { Airport } from 'src/airports/entities/airport.entity';
import { Field, ObjectType } from '@nestjs/graphql';

@Entity()
@ObjectType()
export class StaffMember {
  @PrimaryGeneratedColumn()
  @Field()
  id: number;

  @Column({ type: 'varchar', length: 9 })
  @Field()
  employeeId: string;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn()
  @Field()
  user: User;

  @ManyToOne(() => StaffRole)
  @Field(() => StaffRole)
  role: StaffRole;

  @ManyToMany(() => Flight, (flight) => flight.staffMembers)
  @JoinTable({ name: 'assigned-flights' })
  assignedFlights!: Flight[];

  @ManyToOne(() => Airport, (airport) => airport.staffMembers)
  airport: Airport;
}
