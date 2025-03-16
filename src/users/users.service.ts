import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UserRole } from 'src/enums/user-roles.enum';
import { Admin } from './entities/admin.entity';
import { Passenger } from './entities/passenger.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Admin) private adminRepository: Repository<Admin>,
  ) {}

  createUser(
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    role: UserRole,
  ) {
    const user = this.userRepository.create({
      firstName,
      lastName,
      email,
      password,
      role,
    });
    return this.userRepository.save(user);
  }

  async createSuperAdmin(email: string, password: string) {
    let user = this.userRepository.create({
      email,
      password,
      firstName: 'super',
      lastName: 'admin',
      role: UserRole.SUPER_ADMIN,
      verified: true,
    });
    user = await this.userRepository.save(user);
    const admin = this.adminRepository.create({
      user,
      isSuperUser: true,
    });
    await this.adminRepository.save(admin);
    return user;
  }
  findUserByEmail(email: string) {
    if (!email) return null;
    return this.userRepository.findOne({ where: { email } });
  }

  findUserById(id: number) {
    if (!id) return null;
    return this.userRepository.findOne({ where: { id } });
  }
  findUserByPassenger(passenger: Passenger) {
    return this.userRepository.findOne({ where: { passenger } });
  }
  verifyUser(user: User) {
    user.verified = true;
    return this.userRepository.save(user);
  }

  updateUserPassword(user: User, newPassword: string) {
    user.password = newPassword;
    return this.userRepository.save(user);
  }

  removeUserById(id: number) {
    return this.userRepository.delete({ id });
  }
}
