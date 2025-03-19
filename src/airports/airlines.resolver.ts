import { Args, Int, Query, Mutation, Resolver } from '@nestjs/graphql';
import { AirlinesService } from './airlines.service';
import { Airline } from './entities/airline.entity';
import { UseGuards } from '@nestjs/common';
import { IsLoggedIn } from 'src/guards/is-logged-in.guard';
import { UserRole } from 'src/enums/user-roles.enum';
import { CreateAirlineDto } from './dtos/create-airline.dto';
import { Role } from 'src/decorators/role.decorator';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { Message } from 'src/graphql/mesage.model';
import { UpdateAirlineDto } from './dtos/update-airline.dto';

@Resolver(() => Airline)
export class AirlinesResolver {
  constructor(private airlinesService: AirlinesService) {}

  @Mutation((returns) => Airline)
  @UseGuards(IsLoggedIn)
  @Role(UserRole.ADMIN)
  createAirline(
    @Args('airline') createAirlineDto: CreateAirlineDto,
    @CurrentUser() user: User,
  ) {
    return this.airlinesService.createAirline(createAirlineDto, user);
  }

  @Mutation((returns) => Message)
  @UseGuards(IsLoggedIn)
  @Role(UserRole.ADMIN)
  removeAirline(
    @Args('airlineId', { type: () => Int }) airlineId: number,
    @CurrentUser() user: User,
  ) {
    return this.airlinesService.removeAirline(airlineId, user);
  }

  @Mutation((returns) => Airline)
  @UseGuards(IsLoggedIn)
  @Role(UserRole.ADMIN)
  updateAirline(
    @Args('airline') updateAirlineDto: UpdateAirlineDto,
    @CurrentUser() user: User,
  ) {
    return this.airlinesService.updateAirline(updateAirlineDto, user);
  }

}
