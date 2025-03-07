import { Module } from '@nestjs/common';
import { FlightsService } from './flights.service';
import { FlightsResolver } from './flights.resolver';

@Module({
  providers: [FlightsResolver, FlightsService],
})
export class FlightsModule {}
