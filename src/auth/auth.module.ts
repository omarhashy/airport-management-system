import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Otp } from './entities/otp.entity';
import { QueueModule } from 'src/queue/queue.module';
import { StaffRole } from './entities/staff-role.entity';
import { staffRolesService } from './staff-role.service';
import { staffRolesResolver } from './staff-role.resolver';
import { StaffPermission } from './entities/staff-permission.entity';

@Module({
  providers: [AuthResolver, AuthService, staffRolesService, staffRolesResolver],
  exports: [AuthService, JwtModule],
  imports: [
    TypeOrmModule.forFeature([Otp, StaffRole, StaffPermission]),
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
