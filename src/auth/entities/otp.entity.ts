import { OtpType } from 'src/enums/otp-type.enum';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Otp {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 6, unique: true })
  otp: string;

  @OneToOne(() => User, (user) => user.otp, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @Column({ type: 'enum', enum: OtpType })
  type: OtpType;

  @Column({ type: 'timestamp' })
  expiryDate: Date;
}
