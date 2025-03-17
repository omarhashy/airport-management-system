import { BadRequestException } from '@nestjs/common';
import { Field, InputType, Int } from '@nestjs/graphql';
import { Transform } from 'class-transformer';
import { IsAlphanumeric, IsDate, IsString } from 'class-validator';

@InputType()
export class DelayFlightDto {
  @IsString()
  @IsAlphanumeric()
  @Transform(({ value }) => value.trim())
  @Field()
  flightNumber: string;

  @IsDate()
  @Field(() => Date)
  @Transform(({ value }) => {
    const date = new Date(value);
    const now = new Date();
    if (date.getTime() <= now.getTime() + 3600000) {
      throw new BadRequestException(
        'Departure time must be at least 1 hour from now',
      );
    }
    return date;
  })
  departureTime: Date;
}
