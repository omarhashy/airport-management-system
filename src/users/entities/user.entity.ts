import { Opt } from 'src/auth/entities/opt.entity';
import { UserRole } from 'src/enums/user-roles.enum';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  firstName: string;
  @Column()
  lastName: string;
  @Column()
  email: string;
  @Column()
  password: string;
  @Column({ type: 'enum', enum: UserRole, default: UserRole.PASSENGER })
  role: UserRole;
  @Column()
  verified: boolean;
  @OneToOne(() => Opt, (opt) => opt.user)
  opt?: Opt;
}
