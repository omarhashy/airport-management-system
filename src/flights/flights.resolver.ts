import {
  Query,
  Args,
  Mutation,
  Resolver,
  Subscription,
  ResolveField,
  Parent,
  Context,
} from '@nestjs/graphql';
import { FlightsService } from './flights.service';
import { Flight } from './entities/flight.entity';
import { UseGuards } from '@nestjs/common';
import { IsLoggedIn } from 'src/guards/is-logged-in.guard';
import { Role } from 'src/decorators/role.decorator';
import { UserRole } from 'src/enums/user-roles.enum';
import { createFlightDto } from './dtos/create-flight.dto';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { DelayFlightDto } from './dtos/delay-flight.dto';
import { PubsubService } from 'src/pubsub/pubsub.service';
import { GetFlightsDto } from './dtos/get-flights.dto';
import { DataloaderService } from 'src/dataloader/dataloader.service';
import { Airline } from 'src/airports/entities/airline.entity';
import { Airport } from 'src/airports/entities/airport.entity';

@Resolver(() => Flight)
export class FlightsResolver {
  constructor(
    private readonly flightsService: FlightsService,
    private pubsubService: PubsubService,
    private dataloaderService: DataloaderService,
  ) {}

  @Mutation((returns) => Flight)
  @UseGuards(IsLoggedIn)
  @Role(UserRole.ADMIN)
  async createFlight(
    @Args('FlightData') createFlightDto: createFlightDto,
    @CurrentUser() currentUser: User,
  ) {
    return this.flightsService.createFlight(createFlightDto, currentUser);
  }

  @Mutation((returns) => Flight)
  @UseGuards(IsLoggedIn)
  @Role([UserRole.ADMIN, UserRole.STAFF_MEMBER, UserRole.SUPER_ADMIN])
  async delayFlight(
    @Args('flightData') delayFlightDto: DelayFlightDto,
    @CurrentUser() user: User,
  ) {
    return this.flightsService.delayFlight(delayFlightDto, user);
  }
  @Mutation((returns) => Flight)
  @UseGuards(IsLoggedIn)
  @Role([UserRole.ADMIN, UserRole.STAFF_MEMBER, UserRole.SUPER_ADMIN])
  async cancelFlight(
    @Args('flightNumber') flightNumber: string,
    @CurrentUser() user: User,
  ) {
    return this.flightsService.cancelFlight(flightNumber, user);
  }

  @Subscription(() => Flight, {
    filter: ({ flight }, variables) => {
      flight.departureTime = new Date(flight.departureTime);
      flight.arrivalTime = new Date(flight.arrivalTime);
      return flight.flightNumber === variables.flightNumber;
    },
    resolve: (payload) => payload.flight,
  })
  async flightUpdated(@Args('flightNumber') flightNumber: string) {
    await this.flightsService.findFlightByFlightNumber(flightNumber);
    return this.pubsubService.listenToUpdatedFlight();
  }

  @Query(() => [Flight], { name: 'flights' })
  async getFlights(
    @Args('filter', { type: () => GetFlightsDto, nullable: true })
    filter: GetFlightsDto,
  ) {
    return this.flightsService.getManyFlights(filter);
  }

  @ResolveField(() => Airline)
  async airline(@Parent() flight: Flight, @Context() context: any) {
    if (flight.airline) return flight.airline;

    const loader = this.dataloaderService.getAirlinesLoader(context);
    return loader.load(flight.airlineId);
  }

  @ResolveField(() => Airport)
  async originAirport(@Parent() flight: Flight, @Context() context: any) {
    if (flight.originAirport) return flight.originAirport;
    const loader = this.dataloaderService.getAirportsLoader(context);
    return loader.load(flight.originAirportId);
  }

  @ResolveField(() => Airline)
  async destinationAirport(@Parent() flight: Flight, @Context() context: any) {
    if (flight.destinationAirport) return flight.destinationAirport;
    const loader = this.dataloaderService.getAirportsLoader(context);
    return loader.load(flight.destinationAirportId);
  }
}
