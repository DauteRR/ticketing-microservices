import { TicketUpdatedEventData } from '@drrtickets/common';
import { mongo } from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Ticket, TicketDocument } from '../../models/ticket.model';
import { natsWrapper } from '../../nats-wrapper';
import { TicketUpdatedListener } from '../ticket-updated.listener';

const setup = async (): Promise<
  [TicketUpdatedListener, TicketUpdatedEventData, Message, TicketDocument]
> => {
  const listener = new TicketUpdatedListener(natsWrapper.client);

  const ticket = Ticket.build(new mongo.ObjectId().toHexString(), {
    title: 'Concert',
    price: 100
  });

  await ticket.save();

  const eventDataMock: TicketUpdatedEventData = {
    id: ticket.id,
    price: 1000,
    title: 'New Concert',
    userId: '1',
    version: ticket.version + 1
  };

  // @ts-ignore
  const messageMock: Message = {
    ack: jest.fn()
  };

  return [listener, eventDataMock, messageMock, ticket];
};

describe('TicketUpdated listener', () => {
  it('finds, updates and saves a ticket', async () => {
    const [listener, eventData, message, ticket] = await setup();
    await listener.onMessage(eventData, message);

    const updatedTicket = await Ticket.findById(ticket.id);

    expect(updatedTicket!.title).toEqual(eventData.title);
    expect(updatedTicket!.price).toEqual(eventData.price);
    expect(updatedTicket!.version).toEqual(eventData.version);
  });

  it('acks the message', async () => {
    const [listener, eventData, message] = await setup();
    await listener.onMessage(eventData, message);

    expect(message.ack).toHaveBeenCalled();
  });
});
