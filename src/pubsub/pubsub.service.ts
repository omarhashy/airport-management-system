import { Inject, Injectable } from '@nestjs/common';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { SubscriptionEvents } from 'src/enums/subscription_events.enum';
import { Flight } from 'src/flights/entities/flight.entity';

@Injectable()
export class PubsubService {
  constructor(@Inject('PUB_SUB') private readonly pubSub: RedisPubSub) {}

  updateFlight(flight: Flight) {
    console.log(flight.departureTime);


    this.pubSub.publish(SubscriptionEvents.UpdateFlight, { flight });
  }

  listenToUpdatedFlight() {
    return this.pubSub.asyncIterator(SubscriptionEvents.UpdateFlight);
  }
}
