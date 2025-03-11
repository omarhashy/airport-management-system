import { Module } from '@nestjs/common';
import { AirportsService } from './airports.service';
import { AirportsResolver } from './airports.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Airport } from './entities/airport.entity';
import { AuthModule } from 'src/auth/auth.module';
import { AirlinesService } from './airlines.service';
import { Airline } from './entities/airline.entity';
import { UsersModule } from 'src/users/users.module';
import { AirlinesResolver } from './airlines.resolver';

@Module({
  imports: [
    TypeOrmModule.forFeature([Airport, Airline]),
    AuthModule,
    UsersModule,
  ],
  providers: [AirportsResolver, AirportsService,AirlinesResolver, AirlinesService],
  exports: [AirportsService],
})
export class AirportsModule {}
