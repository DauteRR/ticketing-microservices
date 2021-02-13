import {
  Listener,
  Subject,
  TicketCreatedEvent,
  TicketCreatedEventData
} from '@drrtickets/common';
import { Message } from 'node-nats-streaming';
import { QUEUE_GROUP_NAME } from '../constants';
import { Ticket } from '../models/ticket.model';

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  readonly subject = Subject.TicketCreated;
  queueGroupName = QUEUE_GROUP_NAME;

  async onMessage(
    data: TicketCreatedEventData,
    message: Message
  ): Promise<void> {
    const { title, price, id } = data;

    const ticket = Ticket.build(id, {
      price,
      title
    });
    await ticket.save();

    message.ack();
  }
}
