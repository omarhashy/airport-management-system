import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from 'src/users/users.service';
import { RegisterUserDto } from './Dtos/register-user.dto';
import { User } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Otp } from './entities/otp.entity';
import { Repository } from 'typeorm';
import { OtpType } from 'src/enums/otp-type.enum';
import { VerifyUserEmailDto } from './Dtos/verify-user-email.dto';
import { QueueService } from 'src/queue/queue.service';
import { LoginUserDto } from './Dtos/login-user.dto';
import { ResetUserPasswordDto } from './Dtos/reset-user-password.dto';
import { VerifyResetUserPasswordDto } from './Dtos/verify-reset-user-password.dto';
import { UserRole } from 'src/enums/user-roles.enum';
import { ConfigService } from '@nestjs/config';
import { ResendOtpDto } from './Dtos/resend-otp.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private queueService: QueueService,
    private configService: ConfigService,
    @InjectRepository(Otp) private otpRepository: Repository<Otp>,
  ) {}

  async generateUniqueOtpString(): Promise<string> {
    let otp: string;
    let existingOtp: Otp | null;
    do {
      otp = Array.from({ length: 6 }, () =>
        Math.floor(Math.random() * 10),
      ).join('');
      existingOtp = await this.otpRepository.findOne({ where: { otp } });
    } while (existingOtp);
    return otp;
  }

  findOtpByUser(user: User) {
    if (!user) return null;
    return this.otpRepository.findOne({ where: { user } });
  }

  removeOtp(otp: Otp) {
    if (!otp) return null;
    return this.otpRepository.remove(otp);
  }

  async createOtp(user: User, type?: OtpType): Promise<Otp> {
    let otp = await this.findOtpByUser(user);
    const interval = 3 * 60 * 1000;
    const generatedOtp = await this.generateUniqueOtpString();

    if (type == null) {
      if (!otp) throw new BadRequestException('otp does not exist');
      otp.expiryDate = new Date(Date.now() + interval);
      otp.otp = generatedOtp;
      return this.otpRepository.save(otp);
    }
    if (otp) {
      //reset password
      otp.expiryDate = new Date(Date.now() + interval);
      otp.otp = generatedOtp;
      return this.otpRepository.save(otp);
    }

    otp = this.otpRepository.create({
      user,
      otp: generatedOtp,
      type: type,
      expiryDate: new Date(Date.now() + interval),
    });

    return this.otpRepository.save(otp);
  }

  async registerUser(registerUserDto: RegisterUserDto): Promise<User> {
    if (
      registerUserDto.role == UserRole.SUPER_ADMIN ||
      registerUserDto.email === this.configService.get('SUPER_ADMIN_EMAIL')
    ) {
      throw new UnauthorizedException();
    }

    if (await this.usersService.findUserByEmail(registerUserDto.email)) {
      throw new BadRequestException('email already exist');
    }

    const hashedPassword = await bcrypt.hash(registerUserDto.password, 10);
    const user = await this.usersService.createUser(
      registerUserDto.firstName,
      registerUserDto.lastName,
      registerUserDto.email,
      hashedPassword,
      registerUserDto.role,
    );
    const { otp } = await this.createOtp(user, OtpType.VERIFY_EMAIL);
    this.queueService.sendVerificationEmail(otp, user.email);
    this.queueService.removeUserIfNotVerified(user.id);
    return user;
  }

  async seedSuperAdmin() {
    const email = this.configService.getOrThrow<string>('SUPER_ADMIN_EMAIL');
    if (await this.usersService.findUserByEmail(email)) {
      throw new UnauthorizedException('super admin already exist');
    }
    const hashedPassword = await bcrypt.hash(
      this.configService.getOrThrow<string>('SUPER_ADMIN_PASSWORD'),
      10,
    );
    const user = await this.usersService.createSuperAdmin(
      email,
      hashedPassword,
    );
    return user;
  }

  async verifyUserEmail(verifyUserEmailDto: VerifyUserEmailDto) {
    const user = await this.usersService.findUserByEmail(
      verifyUserEmailDto.email,
    );
    if (!user) throw new BadRequestException('user does not exist');
    if (user.verified)
      throw new BadRequestException("user's email is already verified");
    const otp = await this.findOtpByUser(user);
    if (!otp || otp.type != OtpType.VERIFY_EMAIL)
      throw new BadRequestException('otp does not exist');

    if (
      otp.expiryDate.getTime() < Date.now() ||
      otp.otp != verifyUserEmailDto.otp
    ) {
      throw new UnauthorizedException();
    }

    user.verified = true;
    await this.removeOtp(otp);
    return this.usersService.verifyUser(user);
  }

  async loginUser(loginUserDto: LoginUserDto) {
    const user = await this.usersService.findUserByEmail(loginUserDto.email);
    if (user && !user.verified)
      throw new BadRequestException('user email is not verified');
    if (!user) throw new UnauthorizedException('invalid credentials');
    const passwordMatch = await bcrypt.compare(
      loginUserDto.password,
      user.password,
    );
    if (!passwordMatch) throw new UnauthorizedException('invalid credentials');
    return {
      token: this.jwtService.sign({
        userId: user.id,
      }),
    };
  }

  async resetUserPassword(resetUserPasswordDto: ResetUserPasswordDto) {
    const user = await this.usersService.findUserByEmail(
      resetUserPasswordDto.email,
    );
    if (!user || !user.verified) {
      throw new UnauthorizedException();
    }
    const { otp } = await this.createOtp(user, OtpType.RESET_PASSWORD);
    this.queueService.sendRestPasswordEmail(otp, user.email);
    return { message: 'otp sent successfully' };
  }

  async verifyRestUserPassword(
    verifyResetUserPasswordDto: VerifyResetUserPasswordDto,
  ) {
    const user = await this.usersService.findUserByEmail(
      verifyResetUserPasswordDto.email,
    );
    if (!user) throw new BadRequestException('user does not exist');
    const otp = await this.findOtpByUser(user);
    if (
      !otp ||
      otp.otp != verifyResetUserPasswordDto.otp ||
      otp.type != OtpType.RESET_PASSWORD ||
      otp.expiryDate.getTime() < Date.now()
    ) {
      throw new UnauthorizedException();
    }
    const hashedPassword = await bcrypt.hash(
      verifyResetUserPasswordDto.password,
      10,
    );
    this.removeOtp(otp);
    await this.usersService.updateUserPassword(user, hashedPassword);
    return {
      message: 'password reset successfully',
    };
  }

  async resendOtp(resendOtpDto: ResendOtpDto) {
    const user = await this.usersService.findUserByEmail(resendOtpDto.email);
    if (!user) throw new BadRequestException('user does not exist');
    const { otp, type } = await this.createOtp(user);
    if (type === OtpType.RESET_PASSWORD) {
      this.queueService.sendRestPasswordEmail(otp, user.email);
    }
    if (type === OtpType.VERIFY_EMAIL) {
      this.queueService.sendVerificationEmail(otp, user.email);
    }
    return { message: 'otp resent successfully' };
  }

  async getUserById(id: number) {
    return this.usersService.findUserById(id);
  }
}
