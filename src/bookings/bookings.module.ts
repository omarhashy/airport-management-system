import { forwardRef, Module } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { BookingsResolver } from './bookings.resolver';
import { SeatsService } from './seats.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Seat } from './entities/seats.entity';
import { Booking } from './entities/bookings.entity';
import { UsersModule } from 'src/users/users.module';
import { FlightsModule } from 'src/flights/flights.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  providers: [BookingsResolver, BookingsService, SeatsService],
  imports: [
    TypeOrmModule.forFeature([Seat, Booking]),
    forwardRef(() => FlightsModule),
    forwardRef(() => UsersModule),
    forwardRef(() => AuthModule),
  ],
  exports: [SeatsService],
})
export class BookingsModule {}
