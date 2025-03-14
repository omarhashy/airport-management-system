import { Field, InputType } from '@nestjs/graphql';
import { Transform } from 'class-transformer';
import { IsString, Length } from 'class-validator';

@InputType()
export class CreateAirportDto {
  @IsString()
  @Length(3, 50)
  @Transform(({ value }) => value.trim())
  @Field()
  name: string;

  @IsString()
  @Length(3, 20)
  @Transform(({ value }) => value.trim())
  @Field()
  city: string;

  @IsString()
  @Length(3, 10)
  @Transform(({ value }) => value.trim())
  @Field()
  country: string;
}
