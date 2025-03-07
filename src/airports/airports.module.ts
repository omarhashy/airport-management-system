import { Module } from '@nestjs/common';
import { AirportsService } from './airports.service';
import { AirportsResolver } from './airports.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Airport } from './entities/airport.entity';

@Module({
  // imports: [TypeOrmModule.forFeature([Airport])],
  providers: [AirportsResolver, AirportsService],
})
export class AirportsModule {}
