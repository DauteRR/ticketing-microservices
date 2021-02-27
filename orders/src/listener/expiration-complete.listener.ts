import {
  ExpirationCompleteEvent,
  ExpirationCompleteEventData,
  Listener,
  OrderStatus,
  Subject
} from '@drrtickets/common';
import { Message } from 'node-nats-streaming';
import { QUEUE_GROUP_NAME } from '../constants';
import { Order } from '../models/order.model';
import { OrderCanceledPublisher } from '../publishers/order-canceled.publisher';

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
  readonly subject = Subject.ExpirationComplete;
  queueGroupName = QUEUE_GROUP_NAME;

  async onMessage(
    data: ExpirationCompleteEventData,
    message: Message
  ): Promise<void> {
    const order = await Order.findById(data.orderId).populate('ticket');

    if (!order) {
      console.error('Order not found');
      return;
    }

    order.set({ status: OrderStatus.Canceled });
    await order.save();

    const publisher = new OrderCanceledPublisher(this.client);
    await publisher.publish({
      id: order.id,
      ticket: { id: order.ticket.id },
      version: order.version
    });

    message.ack();
  }
}
