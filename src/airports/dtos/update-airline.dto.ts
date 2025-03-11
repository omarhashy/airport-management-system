import { Field, InputType, Int } from '@nestjs/graphql';
import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsInt,
  IsString,
  IsOptional,
  Length,
} from 'class-validator';

@InputType()
export class UpdateAirlineDto {
  @Field(() => Int)
  @IsNotEmpty()
  @IsInt()
  id: number;

  @Field({ nullable: true })
  @IsString()
  @Length(3, 50)
  @IsOptional()
  @Transform(({ value }) => value.trim())
  name?: string;
}
