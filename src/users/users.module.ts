import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Admin } from './entities/admin.entity';
import { AdminsResolver } from './admins.resolver';
import { AdminsService } from './admins.service';

@Module({
  providers: [UsersResolver, UsersService, AdminsResolver, AdminsService],
  imports: [TypeOrmModule.forFeature([User, Admin])],
  exports: [UsersService],
})
export class UsersModule {}
