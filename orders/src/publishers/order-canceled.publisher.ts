import { Publisher, Subject, OrderCanceledEvent } from '@drrtickets/common';

export class OrderCanceledPublisher extends Publisher<OrderCanceledEvent> {
  readonly subject = Subject.OrderCanceled;
}
