import { Module } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { BookingsResolver } from './bookings.resolver';
import { SeatsService } from './seats.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Seat } from './entities/seats.entity';

@Module({
  providers: [BookingsResolver, BookingsService, SeatsService],
  imports: [TypeOrmModule.forFeature([Seat])],
  exports: [SeatsService],
})
export class BookingsModule {}
