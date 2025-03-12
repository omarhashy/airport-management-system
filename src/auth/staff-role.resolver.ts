import { Query, Args, Int, Mutation, Resolver } from '@nestjs/graphql';
import { StaffRole } from './entities/staff-role.entity';
import { UseGuards } from '@nestjs/common';
import { IsLoggedIn } from 'src/guards/is-logged-in.guard';
import { UserRole } from 'src/enums/user-roles.enum';
import { Role } from 'src/decorators/role.decorator';
import { CreateStaffRoleDto } from './Dtos/staff-role.dto';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { staffRolesService } from './staff-role.service';
import { UpdateStaffRoleDto } from './Dtos/update-staff-role.dto';
import { Message } from 'src/graphql/mesage.model';
import { StaffPermission } from './entities/staff-permission.entity';
import { Permissions } from 'src/enums/permissions.enums';

@Resolver(() => StaffRole)
export class staffRolesResolver {
  constructor(private staffRolesService: staffRolesService) {}

  @Mutation((returns) => StaffRole)
  @UseGuards(IsLoggedIn)
  @Role(UserRole.ADMIN)
  createStaffRole(
    @Args('staffRole') createStaffRoleDto: CreateStaffRoleDto,
    @CurrentUser() user: User,
  ) {
    return this.staffRolesService.createStaffRole(createStaffRoleDto, user);
  }

  @Mutation((returns) => StaffRole)
  @UseGuards(IsLoggedIn)
  @Role(UserRole.ADMIN)
  updateStaffRole(
    @Args('staffRole') updateStaffRoleDto: UpdateStaffRoleDto,
    @CurrentUser() user: User,
  ) {
    return this.staffRolesService.updateStaffRole(updateStaffRoleDto, user);
  }

  @Mutation((returns) => Message)
  @UseGuards(IsLoggedIn)
  @Role(UserRole.ADMIN)
  removeStaffRole(
    @Args('staffRoleId', { type: () => Int }) staffRoleId: number,
    @CurrentUser() user: User,
  ) {
    return this.staffRolesService.removeStaffRole(staffRoleId, user);
  }

  @Mutation((returns) => StaffPermission)
  @UseGuards(IsLoggedIn)
  @Role(UserRole.ADMIN)
  addPermission(
    @Args('staffRoleId', { type: () => Int }) staffRoleId: number,
    @Args('permission', { type: () => Permissions }) permission: number,
    @CurrentUser() user: User,
  ) {
    return this.staffRolesService.addPermission(staffRoleId, permission, user);
  }

  @Mutation((returns) => Message)
  @UseGuards(IsLoggedIn)
  @Role(UserRole.ADMIN)
  removePermission(
    @Args('staffRoleId', { type: () => Int }) staffRoleId: number,
    @Args('permission', { type: () => Permissions }) permission: number,
    @CurrentUser() user: User,
  ) {
    return this.staffRolesService.removePermission(
      staffRoleId,
      permission,
      user,
    );
  }

  @Query(() => StaffRole)
  getStaffRoleById(
    @Args('staffRoleId', { type: () => Int }) staffRoleId: number,
  ) {
    return this.staffRolesService.getAirlineById(staffRoleId);
  }

  //remember to add resolver fields
}
