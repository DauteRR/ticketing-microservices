import {
  Listener,
  OrderCreatedEvent,
  OrderCreatedEventData,
  Subject
} from '@drrtickets/common';
import { Message } from 'node-nats-streaming';
import { QUEUE_GROUP_NAME } from '../constants';
import { Order } from '../models/order';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subject.OrderCreated;
  queueGroupName = QUEUE_GROUP_NAME;

  async onMessage(
    data: OrderCreatedEventData,
    message: Message
  ): Promise<void> {
    const order = Order.build(data.id, {
      price: data.ticket.price,
      status: data.status,
      userId: data.userId,
      version: data.version
    });
    await order.save();

    message.ack();
  }
}
