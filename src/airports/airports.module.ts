import { Module } from '@nestjs/common';
import { AirportsService } from './airports.service';
import { AirportsResolver } from './airports.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Airport } from './entities/airport.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Airport]), AuthModule],
  providers: [AirportsResolver, AirportsService],
})
export class AirportsModule {}
