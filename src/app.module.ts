import { Module, ValidationPipe } from '@nestjs/common';
import { AirportsModule } from './airports/airports.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { FlightsModule } from './flights/flights.module';
import { BookingsModule } from './bookings/bookings.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Airport } from './airports/entities/airport.entity';
import { Airline } from './airports/entities/airline.entity';
import { Flight } from './flights/entities/flight.entity';
import { User } from './users/entities/user.entity';
import { Opt } from './auth/entities/opt.entity';
import { staffRole } from './auth/entities/staff-role.entity';
import { StaffPermission } from './auth/entities/staff-permission.entity';
import { StaffMember } from './users/entities/staff-member.entity';
import { Passenger } from './users/entities/passenger.entity';
import { Admin } from './users/entities/admin.entity';
import { Seat } from './bookings/entities/seats.entity';
import { Booking } from './bookings/entities/bookings.entity';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { APP_PIPE } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'schema.gql',
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          type: 'postgres',
          host: config.get('POSTGRES_HOST'),
          port: config.get('POSTGRES_PORT'),
          username: config.get('POSTGRES_USER'),
          password: config.get('POSTGRES_PASSWORD'),
          entities: [
            Airport,
            Airline,
            Flight,
            User,
            Opt,
            staffRole,
            StaffPermission,
            StaffMember,
            Passenger,
            Admin,
            Seat,
            Booking,
          ],
          database: config.get('POSTGRES_DB'),
          synchronize: true,
          // dropSchema: true,
          // logging: true,
        };
      },
    }),
    AirportsModule,
    UsersModule,
    AuthModule,
    FlightsModule,
    BookingsModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe(),
    },
  ],
})
export class AppModule {}
