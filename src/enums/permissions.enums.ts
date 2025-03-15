import { registerEnumType } from '@nestjs/graphql';

export enum Permissions {
  MANAGE_FLIGHT_STATUS,
  MANAGE_BOOKING_STATUS,
  ASSIGNED_TO_A_FLIGHT,
}

registerEnumType(Permissions, { name: 'Permissions' });
