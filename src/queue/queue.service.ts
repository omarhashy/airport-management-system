import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class QueueService {
  constructor(@InjectQueue('email') private emailQueue: Queue) {}
  sendVerificationEmail(opt: string, emailAddress: string) {
    const email = {
      subject: 'airport management system account verification',
      text: `opt is ${opt}`,
      to: emailAddress,
    };
    this.emailQueue.add('verify use email', email);
  }

  sendRestPasswordEmail(opt: string, emailAddress: string) {
    const email = {
      subject: 'airport management system password reset',
      text: `opt is ${opt}`,
      to: emailAddress,
    };
    this.emailQueue.add('password reset email', email);
  }
}
