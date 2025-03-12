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

@Entity()
export class StaffMember {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 9 })
  employeeId: string;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @ManyToOne(() => StaffRole)
  role: StaffRole;

  @ManyToMany(() => Flight, (flight) => flight.staffMembers)
  @JoinTable({ name: 'assigned-flights' })
  assignedFlights!: Flight[];

  @ManyToOne(() => Airport, (airport) => airport.staffMembers)
  airport: Airport;
}
