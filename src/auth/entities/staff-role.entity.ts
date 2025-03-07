import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { StaffPermission } from './staff-permission.entity';

@Entity()
export class staffRole {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @OneToMany(
    () => StaffPermission,
    (staffPermission) => staffPermission.staffRole,
  )
  staffPermission: StaffPermission;
}
