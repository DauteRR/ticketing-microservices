import {
  Listener,
  Subject,
  PaymentCreatedEvent,
  PaymentCreatedEventData,
  OrderStatus
} from '@drrtickets/common';
import { Message } from 'node-nats-streaming';
import { QUEUE_GROUP_NAME } from '../constants';
import { Order } from '../models/order.model';

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  readonly subject = Subject.PaymentCreated;
  queueGroupName = QUEUE_GROUP_NAME;

  async onMessage(
    data: PaymentCreatedEventData,
    message: Message
  ): Promise<void> {
    const { orderId } = data;
    const order = await Order.findById(orderId);

    if (!order) {
      console.error('Order not found');
      return;
    }

    order.set({
      status: OrderStatus.Complete
    });
    await order.save();

    message.ack();
  }
}
