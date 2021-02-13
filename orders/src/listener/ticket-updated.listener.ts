import {
  Listener,
  Subject,
  TicketUpdatedEvent,
  TicketUpdatedEventData
} from '@drrtickets/common';
import { Message } from 'node-nats-streaming';
import { QUEUE_GROUP_NAME } from '../constants';
import { Ticket } from '../models/ticket.model';

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  readonly subject = Subject.TicketUpdated;
  queueGroupName = QUEUE_GROUP_NAME;

  async onMessage(
    data: TicketUpdatedEventData,
    message: Message
  ): Promise<void> {
    const { title, price } = data;
    const ticket = await Ticket.findById(data.id);

    if (!ticket) {
      throw new Error('Ticket not found');
    }

    ticket.set({ title, price });
    await ticket.save();

    message.ack();
  }
}
