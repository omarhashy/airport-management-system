import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AirportsService } from './airports.service';
import { Airport } from './entities/airport.entity';
import { UseGuards } from '@nestjs/common';
import { IsLoggedIn } from 'src/guards/is-logged-in.guard';
import { Role } from 'src/decorators/role.decorator';
import { UserRole } from 'src/enums/user-roles.enum';
import { CreateAirportDto } from './dtos/create-airport.dto';
import { Message } from 'src/graphql/mesage.model';
import { UpdateAirportDto } from './dtos/update-airport.dto';

@Resolver(() => Airport)
export class AirportsResolver {
  constructor(private readonly airportsService: AirportsService) {}

  @Mutation((returns) => Airport)
  @UseGuards(IsLoggedIn)
  @Role(UserRole.SUPER_ADMIN)
  createAirport(@Args('airport') createAirportDto: CreateAirportDto) {
    return this.airportsService.createAirport(createAirportDto);
  }

  @Mutation((returns) => Message)
  @UseGuards(IsLoggedIn)
  @Role(UserRole.SUPER_ADMIN)
  removeAirport(@Args('airportId', { type: () => Int }) airportId: number) {
    return this.airportsService.removeAirport(airportId);
  }

  @Mutation((returns) => Airport)
  @UseGuards(IsLoggedIn)
  @Role(UserRole.SUPER_ADMIN)
  updateAirport(@Args('airport') updateAirportDto: UpdateAirportDto) {
    return this.airportsService.updateAirport(updateAirportDto);
  }

  @Query(() => Airport, { name: 'getAirportById' })
  getAirportById(@Args('airportId', { type: () => Int }) airportId: number) {
    return this.airportsService.getAirportById(airportId);
  }

  @Query(() => [Airport], { name: 'getAllAirports' })
  getAllAirports(
    @Args('page', { type: () => Int, nullable: true }) page: number = 1,
  ) {
    return this.airportsService.getAirports(page);
  }
}
