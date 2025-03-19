import { Injectable } from '@nestjs/common';
import * as DataLoader from 'dataloader';
import { AirlinesService } from 'src/airports/airlines.service';
import { AirportsService } from 'src/airports/airports.service';
import { Airline } from 'src/airports/entities/airline.entity';
import { Airport } from 'src/airports/entities/airport.entity';

@Injectable()
export class DataloaderService {
  constructor(
    private airlinesService: AirlinesService,
    private airportsService: AirportsService,
  ) {}
  getAirlinesLoader(context: any) {
    if (!context.airlineDataLoader) {
      context.airlineDataLoader = new DataLoader<number, Airline>(
        async (airlinesIds: number[]) => {
          const airlines =
            await this.airlinesService.findAirlinesByIds(airlinesIds);
          const airlinesMap = airlines.reduce(
            (map, airline) => {
              map[airline.id] = airline;
              return map;
            },
            {} as Record<number, Airline>,
          );

          return airlinesIds.map((id) => airlinesMap[id] || null);
        },
      );
    }
    return context.airlineDataLoader;
  }

  getAirportsLoader(context: any) {
    if (!context.airportDataLoader) {
      context.airportDataLoader = new DataLoader<number, Airport>(
        async (ids: number[]) => {
          const airports = await this.airportsService.findAirportsByIds(ids);

          const airportsMap = airports.reduce(
            (map, airport) => {
              map[airport.id] = airport;
              return map;
            },
            {} as Record<number, Airport>,
          );

          return ids.map((id) => airportsMap[id] || null);
        },
      );
    }
    return context.airportDataLoader;
  }
}
