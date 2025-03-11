import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Airline } from './entities/airline.entity';
import { CreateAirlineDto } from './dtos/create-airline.dto';
import { Repository } from 'typeorm';
import { AdminsService } from 'src/users/admins.service';
import { User } from 'src/users/entities/user.entity';
import { UpdateAirlineDto } from './dtos/update-airline.dto';

@Injectable()
export class AirlinesService {
  constructor(
    @InjectRepository(Airline) private airlinesRepository: Repository<Airline>,
    private adminsService: AdminsService,
  ) {}
  async createAirline(createAirlineDto: CreateAirlineDto, user: User) {
    const admin = await this.adminsService.findByUser(user);

    if (!admin) throw new UnauthorizedException();

    const airline = this.airlinesRepository.create({
      airport: admin.airport,
      name: createAirlineDto.name,
    });

    return this.airlinesRepository.save(airline);
  }

  async removeAirline(id: number, user: User) {
    const admin = await this.adminsService.findByUser(user);
    if (!admin) throw new UnauthorizedException();
    const airline = await this.airlinesRepository.findOne({
      where: { id },
      relations: ['airport'],
    });
    if (!airline) throw new BadRequestException('airline does not exist');
    if (airline.airport.id != admin.airport.id)
      throw new UnauthorizedException();
    await this.airlinesRepository.remove(airline);
    return { message: 'airline removed successfully' };
  }

  async updateAirline(updateAirlineDto: UpdateAirlineDto, user: User) {
    const admin = await this.adminsService.findByUser(user);
    if (!admin) throw new UnauthorizedException();
    const airline = await this.airlinesRepository.findOne({
      where: { id: updateAirlineDto.id },
      relations: ['airport'],
    });
    if (!airline) throw new BadRequestException('airline does not exist');
    if (airline.airport.id != admin.airport.id)
      throw new UnauthorizedException();
    this.airlinesRepository.merge(airline, updateAirlineDto);
    return this.airlinesRepository.save(airline);
  }

  async getAirlineById(id: number) {
    const airline = await this.airlinesRepository.findOne({
      where: { id },
      relations: ['airport'],
    });
    if (!airline) throw new NotFoundException('airline not found');
    return airline;
  }
}
