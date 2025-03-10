import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UserRole } from 'src/enums/user-roles.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
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

  findUserByEmail(email: string) {
    if (!email) return null;
    return this.userRepository.findOne({ where: { email } });
  }

  findUserById(id: number) {
    if (!id) return null;
    return this.userRepository.findOne({ where: { id } });
  }
  verifyUser(user: User) {
    user.verified = true;
    return this.userRepository.save(user);
  }

  updateUserPassword(user: User, newPassword: string) {
    user.password = newPassword;
    return this.userRepository.save(user);
  }

  RemoveUserById(id: number) {
    return this.userRepository.delete({ id });
  }
}
