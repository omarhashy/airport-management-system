import { forwardRef, Module } from '@nestjs/common';
import { QueueService } from './queue.service';
import { BullModule } from '@nestjs/bullmq';
import { EmailProcessor } from './workers/email.worker';
import { SendGridService } from './sendgrid.service';
import { UsersModule } from 'src/users/users.module';
import { AuthModule } from 'src/auth/auth.module';
import { RemoveUser } from './workers/remove-user.worker';

@Module({
  providers: [QueueService, EmailProcessor, SendGridService, RemoveUser],
  exports: [QueueService],
  imports: [
    forwardRef(() => AuthModule),
    UsersModule,
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
    BullModule.registerQueue({ name: 'email' }, { name: 'removeUser' }),
  ],
})
export class QueueModule {}
