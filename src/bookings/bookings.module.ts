import { Module } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { BookingsResolver } from './bookings.resolver';

@Module({
  providers: [BookingsResolver, BookingsService],
})
export class BookingsModule {}
