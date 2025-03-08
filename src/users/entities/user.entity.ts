import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Opt } from 'src/auth/entities/opt.entity';
import { UserRole } from 'src/enums/user-roles.enum';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class User {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  firstName: string;

  @Field()
  @Column()
  lastName: string;

  @Field()
  @Column()
  email: string;

  @Field()
  @Column()
  password: string;

  @Field(() => UserRole)
  @Column({ type: 'enum', enum: UserRole, default: UserRole.PASSENGER })
  role: UserRole;
  
  @Field()
  @Column({ default: false })
  verified: boolean;
  
  @OneToOne(() => Opt, (opt) => opt.user)
  opt?: Opt;
}
