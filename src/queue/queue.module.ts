import { Module } from '@nestjs/common';
import { QueueService } from './queue.service';
import { BullModule } from '@nestjs/bullmq';
import { EmailProcessor } from './email.worker';
import { SendGridService } from './sendgrid.service';

@Module({
  providers: [QueueService, EmailProcessor, SendGridService],
  exports: [QueueService],
  imports: [
    BullModule.forRoot({
      connection: {
        host: 'redis',
        port: 6379,
      },
      defaultJobOptions: {
        attempts: 3,
        delay: 1000,
        removeOnComplete: 1000,
        removeOnFail: 3000,
        backoff: 3000,
      },
    }),
    BullModule.registerQueue({ name: 'email' }),
  ],
})
export class QueueModule {}

