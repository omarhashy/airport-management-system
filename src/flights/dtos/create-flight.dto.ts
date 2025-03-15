import { BadRequestException } from '@nestjs/common';
import { Field, InputType, Int } from '@nestjs/graphql';
import { Transform } from 'class-transformer';
import {
  IsAlphanumeric,
  IsDate,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator';

@InputType()
export class createFlightDto {
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

  @IsDate()
  @Field(() => Date)
  @Transform(({ value, obj }) => {
    const arrivalDate = new Date(value);
    const departureDate = new Date(obj.departureTime);
    if (arrivalDate.getTime() <= departureDate.getTime()) {
      throw new BadRequestException(
        'Arrival time must be after the departure time',
      );
    }
    return arrivalDate;
  })
  arrivalTime: Date;

  @IsNumber()
  @IsPositive()
  @Field(() => Int)
  airlineId: number;

  @IsNumber()
  @IsPositive()
  @Field(() => Int)
  originAirportId: number;

  @IsNumber()
  @IsPositive()
  @Field(() => Int)
  destinationAirportId: number;

  @IsNumber()
  @IsPositive()
  @Field(() => Int)
  availableSeats: number;
}
