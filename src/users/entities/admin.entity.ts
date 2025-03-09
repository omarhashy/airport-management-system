import { Airport } from 'src/airports/entities/airport.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Admin {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  isSuperUser: boolean;

  @OneToOne(() => Airport, (airport) => airport.admin)
  @JoinColumn()
  airport: Airport;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;
}
