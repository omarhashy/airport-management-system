import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { StaffPermission } from './staff-permission.entity';
import { Field, ObjectType } from '@nestjs/graphql';
import { Airport } from 'src/airports/entities/airport.entity';

@Entity()
@ObjectType()
export class StaffRole {
  @PrimaryGeneratedColumn()
  @Field()
  id: number;

  @Column()
  @Field()
  name: string;

  @ManyToOne(() => Airport, { nullable: false })
  @Field(() => Airport)
  airport: Airport;

  @OneToMany(
    () => StaffPermission,
    (staffPermission) => staffPermission.staffRole,
  )
  @Field(() => [StaffPermission])
  staffPermissions: StaffPermission[];
}
