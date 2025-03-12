import { registerEnumType } from '@nestjs/graphql';

export enum Permissions {
  MANAGE_FLIGHT_STATUS,
  MANAGE_BOOKING_STATUS,
}

registerEnumType(Permissions, { name: 'Permissions' });
