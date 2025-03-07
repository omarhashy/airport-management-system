import { Resolver } from '@nestjs/graphql';
import { AirportsService } from './airports.service';

@Resolver()
export class AirportsResolver {
  constructor(private readonly airportsService: AirportsService) {}
}
