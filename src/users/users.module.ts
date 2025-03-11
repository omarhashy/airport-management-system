import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Admin } from './entities/admin.entity';
import { AdminsResolver } from './admins.resolver';
import { AdminsService } from './admins.service';
import { AirportsModule } from 'src/airports/airports.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  providers: [UsersResolver, UsersService, AdminsResolver, AdminsService],
  imports: [
    TypeOrmModule.forFeature([User, Admin]),
    forwardRef(() => AirportsModule),
    forwardRef(() => AuthModule),
  ],
  exports: [UsersService, AdminsService],
})
export class UsersModule {}
