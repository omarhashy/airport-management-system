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
import { Field, ObjectType } from '@nestjs/graphql';

@Entity()
@ObjectType()
export class Passenger {
  @PrimaryGeneratedColumn()
  @Field()
  id: number;

  @Column({ type: 'varchar', length: 20 })
  @Field()
  passportNumber: string;

  @Column()
  @Field()
  nationality: string;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn()
  @Field()
  user: User;

  @OneToMany(() => Booking, (booking) => booking.passenger)
  bookings: Booking[];
}
