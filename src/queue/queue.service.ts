import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class QueueService {
  constructor(@InjectQueue('email') private emailQueue: Queue) {}
  sendVerificationEmail(otp: string, emailAddress: string) {
    const email = {
      subject: 'airport management system account verification',
      text: `otp is ${otp}`,
      to: emailAddress,
    };
    this.emailQueue.add('verify use email', email);
  }

  sendRestPasswordEmail(otp: string, emailAddress: string) {
    const email = {
      subject: 'airport management system password reset',
      text: `otp is ${otp}`,
      to: emailAddress,
    };
    this.emailQueue.add('password reset email', email);
  }
}
