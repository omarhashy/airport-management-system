import { Module } from '@nestjs/common';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { PubsubService } from './pubsub.service';

@Module({
  providers: [
    {
      provide: 'PUB_SUB',
      useFactory: () => {
        return new RedisPubSub({
          connection: {
            host: 'redis',
            port: 6379,
          },
        });
      },
    },
    PubsubService,
  ],
  exports: [PubsubService],
})
export class PubsubModule {}
