import { Injectable, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Passenger } from './entities/passenger.entity';
import { IsLoggedIn } from 'src/guards/is-logged-in.guard';
import { Role } from 'src/decorators/role.decorator';
import { UserRole } from 'src/enums/user-roles.enum';
import { PassengersService } from './passengers.service';
import { AddPassengerDataDto } from './dtos/add-passenger-data.dto';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { User } from './entities/user.entity';
import { UpdatePassengerDataDto } from './dtos/update-passenger-data.dto';
import { BookingModel } from 'src/graphql/booking.model';

@Resolver(() => Passenger)
export class PassengersResolver {
  constructor(private passengersService: PassengersService) {}
  @Mutation((returns) => Passenger)
  @UseGuards(IsLoggedIn)
  @Role(UserRole.PASSENGER)
  addPassengerData(
    @Args('passengerData') addPassengerDataDto: AddPassengerDataDto,
    @CurrentUser() user: User,
  ) {
    return this.passengersService.createPassenger(addPassengerDataDto, user);
  }

  @Mutation((returns) => Passenger)
  @UseGuards(IsLoggedIn)
  @Role([UserRole.SUPER_ADMIN, UserRole.PASSENGER])
  updatePassengerData(
    @Args('passengerData') updatePassengerDataDto: UpdatePassengerDataDto,
    @CurrentUser() user: User,
  ) {
    return this.passengersService.updatePassenger(updatePassengerDataDto, user);
  }

  @Query(() => [BookingModel])
  @UseGuards(IsLoggedIn)
  @Role(UserRole.PASSENGER)
  getPassengerBookings(@CurrentUser() user: User) {
    return this.passengersService.getPassengerBookings(user);
  }
}
