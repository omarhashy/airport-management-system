import { Field, InputType } from '@nestjs/graphql';
import { Transform } from 'class-transformer';
import { IsString, Length } from 'class-validator';

@InputType()
export class CreateAirportDto {
  @Field()
  @IsString()
  @Length(3, 50)
  @Transform(({ value }) => value.trim())
  name: string;

  @Field()
  @IsString()
  @Length(3, 20)
  @Transform(({ value }) => value.trim())
  city: string;

  @Field()
  @IsString()
  @Length(3, 10)
  @Transform(({ value }) => value.trim())
  country: string;
}
