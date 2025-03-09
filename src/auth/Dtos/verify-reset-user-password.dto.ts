import { Field, InputType, Int } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsString,
  IsAlphanumeric,
  Length,
  IsEmail,
} from 'class-validator';

@InputType()
export class VerifyResetUserPasswordDto {
  @IsNotEmpty()
  @IsEmail()
  @Field()
  email: string;

  @IsNotEmpty()
  @Length(6, 6, { message: 'opt length should be exactly 6' })
  @Field()
  opt: string;

  @IsString()
  @IsNotEmpty()
  @Length(5, 255)
  @IsAlphanumeric()
  @Field()
  password: string;
}
