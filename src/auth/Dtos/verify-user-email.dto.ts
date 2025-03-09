import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsEmail, Length } from 'class-validator';

@InputType()
export class VerifyUserEmailDto {
  @IsNotEmpty()
  @IsEmail()
  @Field()
  email: string;

  @IsNotEmpty()
  @Length(6, 6, { message: 'otp length should be exactly 6' })
  @Field()
  otp: string;
}
