import { Resolver } from '@nestjs/graphql';
import { BookingsService } from './bookings.service';

@Resolver()
export class BookingsResolver {
  constructor(private readonly bookingsService: BookingsService) {}
}
