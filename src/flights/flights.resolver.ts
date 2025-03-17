import { Args, Mutation, Resolver } from '@nestjs/graphql';
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

@Resolver(() => Flight)
export class FlightsResolver {
  constructor(private readonly flightsService: FlightsService) {}
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
}
