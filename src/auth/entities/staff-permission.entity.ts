import { Permissions } from 'src/enums/permissions.enums';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { StaffRole } from './staff-role.entity';
import { Field, Int, ObjectType } from '@nestjs/graphql';

@Entity()
@ObjectType()
@Unique(['permission', 'staffRole'])
export class StaffPermission {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column({ type: 'enum', enum: Permissions })
  @Field(() => Permissions)
  permission: Permissions;

  @ManyToOne(() => StaffRole, (staffRole) => staffRole.staffPermission)
  staffRole: StaffRole;
}
