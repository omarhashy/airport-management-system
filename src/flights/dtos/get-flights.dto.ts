import { Field, ID, InputType, Int } from '@nestjs/graphql';

@InputType()
export class GetFlightsDto {
  @Field({ nullable: true })
  flightNumber?: string;

  @Field({ nullable: true })
  departureTime?: Date;

  @Field(() => ID, { nullable: true })
  airlineId?: number;

  @Field(() => ID, { nullable: true })
  originAirportId?: number;

  @Field(() => ID, { nullable: true })
  destinationAirportId?: number;

  @Field(() => Int, { defaultValue: 1 })
  page: number;
}
