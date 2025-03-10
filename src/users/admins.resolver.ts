import { Resolver } from '@nestjs/graphql';
import { AdminsService } from './admins.service';

@Resolver()
export class AdminsResolver {
  constructor(private readonly flightsService: AdminsService) {}
}
