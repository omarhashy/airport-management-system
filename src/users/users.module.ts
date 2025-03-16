import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { AdminsResolver } from './admins.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Admin } from './entities/admin.entity';
import { AdminsService } from './admins.service';
import { AirportsModule } from 'src/airports/airports.module';
import { AuthModule } from 'src/auth/auth.module';
import { StaffMemberService } from './staff-members.service';
import { StaffMember } from './entities/staff-member.entity';
import { StaffMemberResolver } from './staff-members.resolver';
import { FlightsModule } from 'src/flights/flights.module';
import { PassengersService } from './passengers.service';
import { Passenger } from './entities/passenger.entity';
import { PassengersResolver } from './passengers.resolver';

@Module({
  providers: [
    AdminsResolver,
    UsersService,
    AdminsService,
    StaffMemberService,
    StaffMemberResolver,
    PassengersService,
    PassengersResolver,
  ],
  imports: [
    TypeOrmModule.forFeature([User, Admin, StaffMember, Passenger]),
    forwardRef(() => AirportsModule),
    forwardRef(() => AuthModule),
    forwardRef(() => FlightsModule),
  ],
  exports: [UsersService, AdminsService],
})
export class UsersModule {}
