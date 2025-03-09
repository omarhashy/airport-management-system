import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber, Length } from 'class-validator';

@InputType()
export class VerifyUserDto {
  @IsNotEmpty()
  @IsNumber()
  @Field(() => Int)
  userId: number;

  @IsNotEmpty()
  @Length(6, 6, { message: 'opt length should be exactly 6' })
  @Field()
  opt: string;
}
