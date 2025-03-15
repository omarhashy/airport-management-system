import { Args, Mutation, Resolver } from '@nestjs/graphql';
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
}
