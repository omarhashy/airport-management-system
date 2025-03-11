import { Airport } from 'src/airports/entities/airport.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Field, ObjectType } from '@nestjs/graphql';

@Entity()
@ObjectType()
export class Admin {
  @PrimaryGeneratedColumn()
  @Field({ name: 'adminId' })
  id: number;

  @Column({ default: false })
  @Field()
  isSuperUser: boolean;

  @OneToOne(() => Airport, (airport) => airport.admin, { onDelete: 'CASCADE' })
  @JoinColumn()
  @Field(() => Airport)
  airport: Airport;

  @OneToOne(() => User, (user) => user.admin, { onDelete: 'CASCADE' })
  @JoinColumn()
  @Field(() => User)
  user: User;
}
