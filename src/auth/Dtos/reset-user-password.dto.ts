import { Field, InputType, Int } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsNumber, Length } from 'class-validator';

@InputType()
export class ResetUserPasswordDto {
  @IsNotEmpty()
  @IsEmail()
  @Field()
  email: string;
}
