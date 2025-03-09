import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsEmail } from 'class-validator';

@InputType()
export class LoginUserDto {
  @IsEmail()
  @Field()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Field()
  password: string;
}
