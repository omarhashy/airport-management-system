import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Otp } from './entities/otp.entity';
import { QueueModule } from 'src/queue/queue.module';

@Module({
  providers: [AuthResolver, AuthService],
  exports: [AuthService],
  imports: [
    TypeOrmModule.forFeature([Otp]),
    UsersModule,
    QueueModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        return {
          secret: config.getOrThrow('JWT_SECRET'),
          signOptions: {
            expiresIn: parseInt(
              config.getOrThrow('ACCESS_TOKEN_VALIDITY_DURATION_IN_SEC'),
            ),
          },
        };
      },
    }),
  ],
})
export class AuthModule {}
