import { forwardRef, Module } from '@nestjs/common';
import { FlightsService } from './flights.service';
import { FlightsResolver } from './flights.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Flight } from './entities/flight.entity';
import { AuthModule } from 'src/auth/auth.module';
import { AirportsModule } from 'src/airports/airports.module';
import { UsersModule } from 'src/users/users.module';
import { BookingsModule } from 'src/bookings/bookings.module';
import { QueueModule } from 'src/queue/queue.module';
import { PubsubModule } from 'src/pubsub/pubsub.module';

@Module({
  providers: [FlightsResolver, FlightsService],
  imports: [
    TypeOrmModule.forFeature([Flight]),
    forwardRef(() => AuthModule),
    forwardRef(() => AirportsModule),
    forwardRef(() => UsersModule),
    BookingsModule,
    QueueModule,
    PubsubModule,
  ],
  exports: [FlightsService],
})
export class FlightsModule {}
