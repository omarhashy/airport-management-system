import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Airport } from './entities/airport.entity';
import {  In, Repository } from 'typeorm';
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
    if (!airport) throw new NotFoundException('Airport not found');
    await this.airportRepository.remove(airport);
    return {
      message: 'Airport removed successfully',
    };
  }

  async updateAirport(updateAirportDto: UpdateAirportDto) {
    let airport = await this.airportRepository.findOne({
      where: { id: updateAirportDto.id },
    });
    if (!airport) throw new NotFoundException('Airport does not exist');

    this.airportRepository.merge(airport, updateAirportDto);
    return this.airportRepository.save(airport);
  }

  async getAirportById(id: number) {
    const airport = await this.airportRepository.findOne({ where: { id } });
    if (!airport) throw new NotFoundException('Airport does not exist');
    return airport;
  }

  async findAirportsByIds(ids: number[]) {
    return this.airportRepository.find({
      where: { id: In(ids) },
    });
  }
  async getAirports(page: number) {
    const limit = 10;
    const offset = (page - 1) * limit;
    const airports = await this.airportRepository.find({
      skip: offset,
      take: limit,
    });
    return airports
    
  }
}
