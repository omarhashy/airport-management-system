import { SetMetadata } from '@nestjs/common';
import { UserRole } from 'src/enums/user-roles.enum';

export const Role = (role: UserRole | UserRole[]) => SetMetadata('role', role);
