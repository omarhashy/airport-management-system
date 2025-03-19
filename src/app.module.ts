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
import { StaffRole } from './auth/entities/staff-role.entity';
import { StaffPermission } from './auth/entities/staff-permission.entity';
import { StaffMember } from './users/entities/staff-member.entity';
import { Passenger } from './users/entities/passenger.entity';
import { Admin } from './users/entities/admin.entity';
import { Seat } from './bookings/entities/seats.entity';
import { Booking } from './bookings/entities/bookings.entity';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { APP_PIPE } from '@nestjs/core';
import { QueueModule } from './queue/queue.module';
import { Otp } from './auth/entities/otp.entity';
import { customErrorFormatter } from './common/errors/error.filter';
import { PubsubModule } from './pubsub/pubsub.module';
import { DataloaderModule } from './dataloader/dataloader.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'src/schema.gql',
      formatError: customErrorFormatter,
      subscriptions: {
        'graphql-ws': true,
        'subscriptions-transport-ws': true,
      },
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
            Admin,
            Airline,
            Flight,
            User,
            Otp,
            StaffRole,
            StaffPermission,
            StaffMember,
            Passenger,
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
    AuthModule,
    AirportsModule,
    UsersModule,
    FlightsModule,
    BookingsModule,
    QueueModule,
    PubsubModule,
    DataloaderModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        transform: true,
      }),
    },
  ],
})
export class AppModule {}
