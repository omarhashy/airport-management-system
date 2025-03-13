import { Args, Int, Mutation, Resolver } from '@nestjs/graphql';
import { AdminsService } from './admins.service';
import { Admin } from './entities/admin.entity';
import { Role } from 'src/decorators/role.decorator';
import { UseGuards } from '@nestjs/common';
import { IsLoggedIn } from 'src/guards/is-logged-in.guard';
import { UserRole } from 'src/enums/user-roles.enum';
import { Message } from 'src/graphql/mesage.model';

@Resolver(() => Admin)
export class UsersResolver {
  constructor(private readonly adminsService: AdminsService) {}

  @Mutation((returns) => Admin)
  @UseGuards(IsLoggedIn)
  @Role(UserRole.SUPER_ADMIN)
  async assignAdminToAnAirport(
    @Args('adminEmail') adminEmail: string,
    @Args('airportId', { type: () => Int }) airportId: number,
  ) {
    return this.adminsService.assignAdmin(adminEmail, airportId);
  }
  @Mutation((returns) => Message)
  @UseGuards(IsLoggedIn)
  @Role(UserRole.SUPER_ADMIN)
  async removeAdmin(@Args('adminEmail') adminEmail: string) {
    return this.adminsService.removeAdmin(adminEmail);
  }
}
