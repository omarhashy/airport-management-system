import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Booking } from 'src/bookings/entities/bookings.entity';

@Entity()
export class Passenger {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 20 })
  passportNumber: string;

  @Column()
  nationality: string;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @OneToMany(() => Booking, (booking) => booking.passenger)
  bookings: Booking[];
}
