import {
  Listener,
  OrderCanceledEvent,
  OrderCanceledEventData,
  Subject
} from '@drrtickets/common';
import { Message } from 'node-nats-streaming';
import { QUEUE_GROUP_NAME } from '../constants';
import { Ticket } from '../models/ticket.model';
import { TicketUpdatedPublisher } from '../publishers/ticket-updated.publisher';

export class OrderCanceledListener extends Listener<OrderCanceledEvent> {
  readonly subject = Subject.OrderCanceled;
  queueGroupName = QUEUE_GROUP_NAME;

  async onMessage(
    data: OrderCanceledEventData,
    message: Message
  ): Promise<void> {
    const ticket = await Ticket.findById(data.ticket.id);

    if (!ticket) {
      console.error(`Ticket with id ${data.ticket.id} not found`);
      return;
    }

    ticket.set({ orderId: undefined });

    await ticket.save();

    const publisher = new TicketUpdatedPublisher(this.client);
    publisher.publish({
      id: ticket.id,
      price: ticket.price,
      title: ticket.title,
      userId: ticket.userId,
      version: ticket.version,
      orderId: ticket.orderId
    });

    message.ack();
  }
}
