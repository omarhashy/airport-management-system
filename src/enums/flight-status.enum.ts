import { registerEnumType } from '@nestjs/graphql';

export enum FlightStatus {
  ON_TIME,
  DELAYED,
  CANCELLED,
  DEPARTED,
  ARRIVED,
}

registerEnumType(FlightStatus, { name: 'FlightStatus' });
