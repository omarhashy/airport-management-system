import { registerEnumType } from '@nestjs/graphql';

export enum BookingStatus {
  VERIFIED,
  PENDING,
  CANCELLED,
}

registerEnumType(BookingStatus, { name: 'BookingStatus' });
