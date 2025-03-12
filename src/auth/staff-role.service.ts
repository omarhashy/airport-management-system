import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StaffRole } from './entities/staff-role.entity';
import { Repository } from 'typeorm';
import { CreateStaffRoleDto } from './Dtos/staff-role.dto';
import { User } from 'src/users/entities/user.entity';
import { AdminsService } from 'src/users/admins.service';
import { UpdateStaffRoleDto } from './Dtos/update-staff-role.dto';
import { Permissions } from 'src/enums/permissions.enums';
import { StaffPermission } from './entities/staff-permission.entity';

@Injectable()
export class staffRolesService {
  constructor(
    @InjectRepository(StaffRole)
    private staffRoleRepository: Repository<StaffRole>,
    @InjectRepository(StaffPermission)
    private staffPermissionRepository: Repository<StaffPermission>,
    private adminsService: AdminsService,
  ) {}

  async createStaffRole(createStaffRoleDto: CreateStaffRoleDto, user: User) {
    const admin = await this.adminsService.findByUser(user);
    if (!admin) throw new UnauthorizedException();

    if (
      await this.staffRoleRepository.exists({
        where: {
          name: createStaffRoleDto.name,
          airport: { id: admin.airport.id },
        },
      })
    ) {
      throw new BadRequestException('staffRole already exist');
    }
    const staffRole = this.staffRoleRepository.create({
      name: createStaffRoleDto.name,
      airport: { id: admin.airport.id },
    });
    return this.staffRoleRepository.save(staffRole);
  }

  async updateStaffRole(updateStaffRoleDto: UpdateStaffRoleDto, user: User) {
    const admin = await this.adminsService.findByUser(user);
    if (!admin) throw new UnauthorizedException();
    const staffRole = await this.staffRoleRepository.findOne({
      where: {
        id: updateStaffRoleDto.id,
      },
      relations: ['airport'],
    });
    if (!staffRole) throw new BadRequestException('staffRoe does not exist');
    if (staffRole.airport.id != admin.airport.id) {
      throw new UnauthorizedException();
    }
    this.staffRoleRepository.merge(staffRole, updateStaffRoleDto);
    return this.staffRoleRepository.save(staffRole);
  }

  async removeStaffRole(id: number, user: User) {
    const admin = await this.adminsService.findByUser(user);
    if (!admin) throw new UnauthorizedException();
    const staffRole = await this.staffRoleRepository.findOne({
      where: {
        id,
      },
      relations: ['airport'],
    });
    if (!staffRole) throw new BadRequestException('staffRoe does not exist');
    if (staffRole.airport.id != admin.airport.id) {
      throw new UnauthorizedException();
    }
    await this.staffRoleRepository.remove(staffRole);
    return { message: 'staffRole removed successfully' };
  }

  async getAirlineById(id: number) {
    const staffRole = await this.staffRoleRepository.findOne({
      where: {
        id: id,
      },
    });
    if (!staffRole) throw new NotFoundException();
    return staffRole;
  }

  async addPermission(
    staffRoleId: number,
    permission: Permissions,
    user: User,
  ) {
    const admin = await this.adminsService.findByUser(user);
    if (!admin) throw new UnauthorizedException();
    const staffRole = await this.staffRoleRepository.findOne({
      where: {
        id: staffRoleId,
      },
      relations: ['airport'],
    });
    if (!staffRole) throw new BadRequestException('staffRoe does not exist');
    if (staffRole.airport.id != admin.airport.id) {
      throw new UnauthorizedException();
    }
    const staffPermission = this.staffPermissionRepository.create({
      permission,
      staffRole,
    });
    return this.staffPermissionRepository.save(staffPermission);
  }

  async removePermission(
    staffRoleId: number,
    permission: Permissions,
    user: User,
  ) {
    const admin = await this.adminsService.findByUser(user);
    if (!admin) throw new UnauthorizedException();
    const staffRole = await this.staffRoleRepository.findOne({
      where: {
        id: staffRoleId,
      },
      relations: ['airport'],
    });
    if (!staffRole) throw new BadRequestException('staffRoe does not exist');
    if (staffRole.airport.id != admin.airport.id) {
      throw new UnauthorizedException();
    }
    const staffPermission = await this.staffPermissionRepository.findOne({
      where: {
        permission,
        staffRole,
      },
    });
    if (!staffPermission)
      throw new BadRequestException('staffPermission does not exist');
    await this.staffPermissionRepository.remove(staffPermission);
    return { message: 'permission removed successfully' };
  }
}
