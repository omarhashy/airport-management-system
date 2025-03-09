import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Otp } from 'src/auth/entities/otp.entity';
import { UserRole } from 'src/enums/user-roles.enum';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class User {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @Column()
  @Field()
  firstName: string;

  @Column()
  @Field()
  lastName: string;

  @Column()
  @Field()
  email: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.PASSENGER })
  @Field(() => UserRole)
  role: UserRole;

  @Column({ default: false })
  @Field()
  verified: boolean;

  @OneToOne(() => Otp, (otp => otp.user))
  otp?: Otp;
}
