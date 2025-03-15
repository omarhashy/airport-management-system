import { Field, InputType, Int } from '@nestjs/graphql';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsPositive,
  IsString,
  Length,
} from 'class-validator';

@InputType()
export class AssignStaffMemberDto {
  @IsString()
  @IsNumberString()
  @Length(9, 9)
  @Transform(({ value }) => value.trim())
  @Field()
  employeeId: string;

  @IsNotEmpty()
  @IsEmail()
  @Field()
  userEmail: string;

  @IsNumber()
  @IsPositive()
  @Field(() => Int)
  roleId: number;
}
