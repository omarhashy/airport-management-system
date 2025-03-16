import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StaffMember } from './entities/staff-member.entity';
import { Repository } from 'typeorm';
import { UsersService } from './users.service';
import { AssignStaffMemberDto } from './dtos/assign-staff-member.dto';
import { UserRole } from 'src/enums/user-roles.enum';
import { User } from './entities/user.entity';
import { AdminsService } from './admins.service';
import { StaffRolesService } from 'src/auth/staff-role.service';
import { FlightsService } from 'src/flights/flights.service';
import { AirlinesService } from 'src/airports/airlines.service';
import { Permissions } from 'src/enums/permissions.enums';

@Injectable()
export class StaffMemberService {
  constructor(
    @InjectRepository(StaffMember)
    private staffMemberRepository: Repository<StaffMember>,
    private usersService: UsersService,
    private adminsService: AdminsService,
    private staffRolesService: StaffRolesService,
    private flightService: FlightsService,
  ) {}

  async assignStaffMember(
    assignStaffMemberDto: AssignStaffMemberDto,
    currentUser: User,
  ) {
    const admin = await this.adminsService.findByUser(currentUser);
    const user = await this.usersService.findUserByEmail(
      assignStaffMemberDto.userEmail,
    );
    if (!user) throw new BadRequestException('staff member does not exist');

    if (user.role != UserRole.STAFF_MEMBER)
      throw new BadRequestException('staff member does not exist');

    if (!user.verified) {
      throw new BadRequestException('user email is not verified');
    }
    const staffMemberRole = await this.staffRolesService.getStaffRoleById(
      assignStaffMemberDto.roleId,
    );

    const staffMember = this.staffMemberRepository.create({
      employeeId: assignStaffMemberDto.employeeId,
      user: user,
      role: staffMemberRole,
      airport: admin?.airport,
    });
    return this.staffMemberRepository.save(staffMember);
  }

  async removeStaffMember(email: string, currentUser: User) {
    const user = await this.usersService.findUserByEmail(email);
    if (!user) throw new BadRequestException('staffUser does not exist');
    const admin = await this.adminsService.findByUser(currentUser);
    if (!admin) throw new UnauthorizedException();
    const staffMember = await this.staffMemberRepository.findOne({
      where: {
        user,
      },
      relations: ['airport'],
    });
    if (!staffMember || staffMember.airport.id != admin.airport.id)
      throw new BadRequestException(
        "user is not a staff member for the admin's airport",
      );

    await this.staffMemberRepository.remove(staffMember);
    return { message: 'staff member has been removed' };
  }

  async assignStaffMemberToAFlight(
    email: string,
    flightNumber: string,
    currentUser: User,
  ) {
    const flight =
      await this.flightService.findFlightByFlightNumber(flightNumber);
    const admin = await this.adminsService.findByUser(currentUser);
    if (admin?.airport.id != flight.airline.airport.id)
      throw new UnauthorizedException();
    const staffUser = await this.usersService.findUserByEmail(email);
    if (!staffUser) {
      throw new BadRequestException('staff user does not exist');
    }
    const staffMember = await this.staffMemberRepository.findOne({
      where: { user: staffUser },
      relations: ['assignedFlights', 'airport', 'role.staffPermissions'],
    });

    if (!staffMember || staffMember.airport.id != admin.airport.id) {
      throw new BadRequestException(
        "staff user user is not a staff member to the admin's airport",
      );
    }

    if (
      !staffMember?.role.staffPermissions.some(
        (staffPermission) =>
          staffPermission.permission === Permissions.ASSIGNED_TO_A_FLIGHT,
      )
    ) {
      throw new BadRequestException(
        'staffMember can not be assigned to a flight',
      );
    }
    if (staffMember?.airport.id != admin.airport.id) {
      throw new BadRequestException(
        "staff user does not assigned to the admin's airport",
      );
    }
    for (const assignedFlight of staffMember.assignedFlights) {
      if (
        assignedFlight.departureTime.getDate() <=
          flight.departureTime.getDate() &&
        assignedFlight.arrivalTime.getDate() >= flight.departureTime.getDate()
      ) {
        throw new BadRequestException(
          'staff member is not available in the provided departure time',
        );
      }
      if (
        assignedFlight.departureTime.getDate() <=
          flight.arrivalTime.getDate() &&
        assignedFlight.arrivalTime.getDate() >= flight.arrivalTime.getDate()
      ) {
        throw new BadRequestException(
          'staff member is not available in the provided arrivalTime time',
        );
      }
    }

    staffMember.assignedFlights.push(flight);
    return this.staffMemberRepository.save(staffMember);
  }

  async getUserByStaffMember(staffMember: StaffMember) {
    return (
      await this.staffMemberRepository.findOne({
        where: { id: staffMember.id },
        relations: ['user'],
      })
    )?.user;
  }
}
