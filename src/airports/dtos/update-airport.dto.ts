import { Field, InputType } from '@nestjs/graphql';
import { Transform } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

@InputType()
export class UpdateAirportDto {
  @Field()
  @IsNotEmpty()
  @IsInt()
  id: number;

  @Field({ nullable: true })
  @IsString()
  @Length(3, 50)
  @IsOptional()
  @Transform(({ value }) => value.trim())
  name?: string;

  @Field({ nullable: true })
  @IsString()
  @Length(3, 20)
  @IsOptional()
  @Transform(({ value }) => value.trim())
  city?: string;

  @Field({ nullable: true })
  @IsString()
  @Length(3, 10)
  @IsOptional()
  @Transform(({ value }) => value.trim())
  country?: string;
}
