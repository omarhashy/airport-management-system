import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty } from 'class-validator';

@InputType()
export class ResetUserPasswordDto {
  @IsNotEmpty()
  @IsEmail()
  @Field()
  email: string;
}
