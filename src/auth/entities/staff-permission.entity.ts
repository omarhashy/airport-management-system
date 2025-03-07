import { Permissions } from 'src/enums/premessions.enums';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,

} from 'typeorm';
import { staffRole } from './staff-role.entity';

@Entity()
@Unique(['permission', 'staffRole'])
export class StaffPermission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: Permissions })
  permission: Permissions;

  @ManyToOne(() => staffRole, (staffRole) => staffRole.staffPermission)
  staffRole: staffRole;
}
