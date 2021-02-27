import Queue from 'bull';
import { natsWrapper } from './nats-wrapper';
import { ExpirationCompletePublisher } from './publisher/expiration-complete.publisher';

export interface ExpirationQueueJobPayload {
  orderId: string;
}

export const expirationQueue = new Queue<ExpirationQueueJobPayload>(
  'order:expiration',
  {
    redis: {
      host: process.env.REDIS_HOST
    }
  }
);

expirationQueue.process(async job => {
  const publisher = new ExpirationCompletePublisher(natsWrapper.client);
  publisher.publish({
    orderId: job.data.orderId
  });
});
