import { OptType } from 'src/enums/opt-type.enum';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Opt {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 6, unique: true })
  opt: string;

  @OneToOne(() => User, (user) => user.opt, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @Column({ type: 'enum', enum: OptType })
  type: OptType;

  @Column({ type: 'timestamp' })
  expiryDate: Date;
}
