import { Field, InputType, Int } from '@nestjs/graphql';
import { Transform } from 'class-transformer';
import {
  IsAlphanumeric,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsPositive,
  IsString,
} from 'class-validator';

@InputType()
export class UpdatePassengerDataDto {
  @IsInt()
  @IsPositive()
  @IsEmail()
  @Field({ nullable: true })
  email!: string;

  @IsString()
  @IsNotEmpty()
  @IsAlphanumeric()
  @Transform(({ value }) => value.trim())
  @Field({ nullable: true })
  passportNumber!: string;

  @IsString()
  @IsNotEmpty()
  @IsAlphanumeric()
  @Transform(({ value }) => value.trim())
  @Field({ nullable: true })
  nationality!: string;
}
