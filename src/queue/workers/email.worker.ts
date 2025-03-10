import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { SendGridService } from '../sendgrid.service';

@Processor('email', { limiter: { duration: 10000, max: 20 } })
export class EmailProcessor extends WorkerHost {
  constructor(private sendGridService: SendGridService) {
    super();
  }
  async process(job: Job): Promise<any> {
    const data = job.data;
    await this.sendGridService.sendEmail(data);
  }
}
