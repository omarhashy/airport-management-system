import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from './entities/admin.entity';
import { AirportsService } from 'src/airports/airports.service';
import { UsersService } from './users.service';
import { UserRole } from 'src/enums/user-roles.enum';

@Injectable()
export class AdminsService {
  constructor(
    @InjectRepository(Admin) private adminRepository: Repository<Admin>,
    private airportsService: AirportsService,
    private usersService: UsersService,
  ) {}
  async assignAdmin(userEmail: string, airportId: number) {
    const user = await this.usersService.findUserByEmail(userEmail);
    if (!user) throw new BadRequestException('user does not exist');
    if (user.role != UserRole.ADMIN)
      throw new BadRequestException('user does not exist');
    const airport = await this.airportsService.getAirportById(airportId);
    if (!airport) throw new BadRequestException('user does not exist');
    let admin = this.adminRepository.create({
      user,
      airport,
    });

    try {
      admin = await this.adminRepository.save(admin);
    } catch (error) {
      throw new BadRequestException(
        'each admin should be assigned only to one airport',
      );
    }
    console.log(admin);

    return admin;
  }
}
