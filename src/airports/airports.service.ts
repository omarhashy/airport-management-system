import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Airport } from './entities/airport.entity';
import { Repository } from 'typeorm';
import { CreateAirportDto } from './dtos/create-airport.dto';
import { UpdateAirportDto } from './dtos/update-airport.dto';

@Injectable()
export class AirportsService {
  constructor(
    @InjectRepository(Airport) private airportRepository: Repository<Airport>,
  ) {}

  async createAirport(createAirportDto: CreateAirportDto) {
    const { name, city, country } = createAirportDto;
    const airport = this.airportRepository.create({ name, city, country });
    return this.airportRepository.save(airport);
  }

  async removeAirport(id: number) {
    const airport = await this.airportRepository.findOne({ where: { id } });
    if (!airport) throw new BadRequestException('Airport not found');
    await this.airportRepository.remove(airport);
    return {
      message: 'Airport removed successfully',
    };
  }

  async updateAirport(updateAirportDto: UpdateAirportDto) {
    let airport = await this.airportRepository.findOne({
      where: { id: updateAirportDto.id },
    });
    if (!airport) throw new BadRequestException('Airport does not exist');
    airport = { ...airport, ...UpdateAirportDto };
    return this.airportRepository.save(airport);
  }
}
