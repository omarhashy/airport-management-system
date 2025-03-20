import {
  Args,
  Mutation,
  Parent,
  ResolveField,
  Resolver,
  Query,
} from '@nestjs/graphql';
import { StaffMember } from './entities/staff-member.entity';
import { UseGuards } from '@nestjs/common';
import { IsLoggedIn } from 'src/guards/is-logged-in.guard';
import { Role } from 'src/decorators/role.decorator';
import { UserRole } from 'src/enums/user-roles.enum';
import { AssignStaffMemberDto } from './dtos/assign-staff-member.dto';
import { StaffMemberService } from './staff-members.service';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { User } from './entities/user.entity';
import { Message } from 'src/graphql/mesage.model';
import { Flight } from 'src/flights/entities/flight.entity';

@Resolver(() => StaffMember)
export class StaffMemberResolver {
  constructor(private staffMembersService: StaffMemberService) {}
  @Mutation((returns) => StaffMember)
  @UseGuards(IsLoggedIn)
  @Role(UserRole.ADMIN)
  async assignStaffMemberToAnAirport(
    @Args('userData') assignStaffMemberDto: AssignStaffMemberDto,
    @CurrentUser() user: User,
  ) {
    return this.staffMembersService.assignStaffMember(
      assignStaffMemberDto,
      user,
    );
  }

  @Mutation((returns) => Message)
  @UseGuards(IsLoggedIn)
  @Role(UserRole.ADMIN)
  async unassignStaffMemberFromAnAirport(
    @Args('staffMemberEmail') email: string,
    @CurrentUser() user: User,
  ) {
    return this.staffMembersService.removeStaffMember(email, user);
  }

  @Mutation((returns) => StaffMember)
  @UseGuards(IsLoggedIn)
  @Role(UserRole.ADMIN)
  async assignStaffMemberToAFlight(
    @Args('userEmail') email: string,
    @Args('flightNumber') flightNumber: string,
    @CurrentUser() user: User,
  ) {
    return this.staffMembersService.assignStaffMemberToAFlight(
      email,
      flightNumber,
      user,
    );
  }

  @ResolveField('userData', () => User)
  getStaffMemberUser(@Parent() staffMember: StaffMember) {
    return this.staffMembersService.getUserByStaffMember(staffMember);
  }

  @Query(() => [Flight])
  @UseGuards(IsLoggedIn)
  @Role(UserRole.STAFF_MEMBER)
  getAssignedFlights(@CurrentUser() user: User) {
    return this.staffMembersService.getAssignedFlights(user);
  }
}
