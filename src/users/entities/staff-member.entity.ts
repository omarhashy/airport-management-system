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
import { staffRole } from 'src/auth/entities/staff-role.entity';

@Entity()
export class StaffMember {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 9 })
  employeeId: string;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @ManyToOne(() => staffRole)
  role: staffRole;

  @ManyToMany(() => Flight, (flight) => flight.staffMembers)
  @JoinTable({ name: 'assigned-flights' })
  assignedFlights!: Flight[];
}
