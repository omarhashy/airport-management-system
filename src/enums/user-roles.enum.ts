import { registerEnumType } from '@nestjs/graphql';

export enum UserRole {
  SUPER_ADMIN,
  ADMIN,
  STAFF_MEMBER,
  PASSENGER,
}

registerEnumType(UserRole, { name: 'UserRole' });
