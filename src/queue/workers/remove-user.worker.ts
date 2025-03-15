import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { AuthService } from 'src/auth/auth.service';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

@Processor('removeUser', { limiter: { duration: 10000, max: 20 } })
export class RemoveUser extends WorkerHost {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {
    super();
  }
  async process(job: Job): Promise<any> {
    const user = await this.usersService.findUserById(job.data.userId);
    if (!user || user.verified) {
      return;
    }

    const otp = await this.authService.findOtpByUser(user);
    if (user) {
      this.usersService.removeUserById(user.id);
    }
    if (otp) {
      this.authService.removeOtp(otp);
    }
  }
}
