import { registerEnumType } from '@nestjs/graphql';

export enum FlightStatus {
  ON_TIME,
  DELAYED,
  CANCELLED,
}

registerEnumType(FlightStatus, { name: 'FlightStatus' });
