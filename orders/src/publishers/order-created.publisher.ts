import { Publisher, Subject, OrderCreatedEvent } from '@drrtickets/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subject.OrderCreated;
}
