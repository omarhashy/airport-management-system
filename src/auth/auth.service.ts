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
import { Opt } from './entities/opt.entity';
import { Repository } from 'typeorm';
import { OptType } from 'src/enums/opt-type.enum';
import { VerifyUserDto } from './Dtos/verify-user.dto';
import { QueueService } from 'src/queue/queue.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private queueService: QueueService,
    @InjectRepository(Opt) private optRepository: Repository<Opt>,
  ) {}

  async generateUniqueOptString(): Promise<string> {
    let opt: string;
    let existingOpt: Opt | null;
    do {
      opt = Array.from({ length: 6 }, () =>
        Math.floor(Math.random() * 10),
      ).join('');
      existingOpt = await this.optRepository.findOne({ where: { opt } });
    } while (existingOpt);
    return opt;
  }

  findOptByUser(user: User) {
    if (!User) return null;
    return this.optRepository.findOne({ where: { user } });
  }

  removeOpt(opt: Opt) {
    if (!opt) return null;
    return this.optRepository.remove(opt);
  }

  async createVerifyEmailOpt(user: User) {
    let opt = await this.findOptByUser(user);
    if (opt) {
      if (opt.expiryDate.getTime() < Date.now()) await this.removeOpt(opt);
      else throw new BadRequestException('opt is still valid');
    }
    opt = this.optRepository.create({
      user,
      opt: await this.generateUniqueOptString(),
      type: OptType.VERIFY_EMAIL,
      expiryDate: new Date(Date.now() + 3 * 60 * 1000),
    });
    return this.optRepository.save(opt);
  }

  async registerUser(registerUserDto: RegisterUserDto): Promise<User> {
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
    const { opt } = await this.createVerifyEmailOpt(user);
    this.queueService.sendVerificationEmail(opt, user.email);
    return user;
  }
  async verifyUser(verifyUserDto: VerifyUserDto) {
    const user = await this.usersService.findUserById(verifyUserDto.userId);
    if (!user) throw new BadRequestException('user does not exist');
    if (user.verified) throw new BadRequestException();
    const opt = await this.findOptByUser(user);
    if (!opt) throw new BadRequestException('opt does not exist');

    if (opt.expiryDate.getDate() > Date.now() || opt.opt != verifyUserDto.opt) {
      throw new UnauthorizedException();
    }

    user.verified = true;
    await this.removeOpt(opt);
    return this.usersService.verifyUser(user);
  }
}
