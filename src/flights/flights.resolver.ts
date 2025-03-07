import { Resolver } from '@nestjs/graphql';
import { FlightsService } from './flights.service';

@Resolver()
export class FlightsResolver {
  constructor(private readonly flightsService: FlightsService) {}
}
