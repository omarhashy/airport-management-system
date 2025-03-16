import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Passenger } from './entities/passenger.entity';
import { Repository } from 'typeorm';
import { AddPassengerDataDto } from './dtos/add-passenger-data.dto';
import { User } from './entities/user.entity';
import { UpdateAirlineDto } from 'src/airports/dtos/update-airline.dto';
import { UserRole } from 'src/enums/user-roles.enum';
import { UpdatePassengerDataDto } from './dtos/update-passenger-data.dto';
import { UsersService } from './users.service';

@Injectable()
export class PassengersService {
  constructor(
    @InjectRepository(Passenger)
    private passengerRepository: Repository<Passenger>,
    private userService: UsersService,
  ) {}

  async createPassenger(addPassengerDataDto: AddPassengerDataDto, user: User) {
    if (
      await this.passengerRepository.exists({
        where: { user },
      })
    ) {
      throw new BadRequestException('passenger data already exists');
    }

    const passenger = this.passengerRepository.create({
      user,
      passportNumber: addPassengerDataDto.passportNumber,
      nationality: addPassengerDataDto.nationality,
    });
    return this.passengerRepository.save(passenger);
  }

  async updatePassenger(
    updatePassengerDataDto: UpdatePassengerDataDto,
    user: User,
  ) {
    let passenger: Passenger | null = null;
    if (user.role === UserRole.SUPER_ADMIN && updatePassengerDataDto.email) {
      const user = await this.userService.findUserByEmail(
        updatePassengerDataDto.email,
      );
      if (!user || user.role != UserRole.PASSENGER)
        throw new BadRequestException('invalid email address');
      passenger = await this.passengerRepository.findOne({
        where: {
          user,
        },
      });
    } else if (user.role === UserRole.PASSENGER) {
      passenger = await this.passengerRepository.findOne({
        where: {
          user,
        },
      });
    }
    if (!passenger) throw new BadRequestException('passenger does not exist');
    this.passengerRepository.merge(passenger, {
      nationality: updatePassengerDataDto.nationality,
      passportNumber: updatePassengerDataDto.passportNumber,
    });
    return this.passengerRepository.save(passenger);
  }

  getPassengerByUser(user: User) {
    return this.passengerRepository.findOne({
      where: {
        user,
      },
    });
  }
}
