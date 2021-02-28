import {
  Listener,
  OrderCanceledEvent,
  OrderCanceledEventData,
  OrderStatus,
  Subject
} from '@drrtickets/common';
import { Message } from 'node-nats-streaming';
import { QUEUE_GROUP_NAME } from '../constants';
import { Order } from '../models/order';

export class OrderCanceledListener extends Listener<OrderCanceledEvent> {
  readonly subject = Subject.OrderCanceled;
  queueGroupName = QUEUE_GROUP_NAME;

  async onMessage(
    data: OrderCanceledEventData,
    message: Message
  ): Promise<void> {
    const order = await Order.findOne({
      _id: data.id,
      version: data.version - 1
    });

    if (!order) {
      console.error('Order not found');
      return;
    }

    order.set({
      status: OrderStatus.Canceled
    });
    await order.save();

    message.ack();
  }
}
