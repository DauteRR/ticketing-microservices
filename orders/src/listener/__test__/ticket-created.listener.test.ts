import { TicketCreatedEventData } from '@drrtickets/common';
import { mongo } from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../models/ticket.model';
import { natsWrapper } from '../../nats-wrapper';
import { TicketCreatedListener } from '../ticket-created.listener';

const setup = async (): Promise<
  [TicketCreatedListener, TicketCreatedEventData, Message]
> => {
  const listener = new TicketCreatedListener(natsWrapper.client);

  const eventDataMock: TicketCreatedEventData = {
    id: new mongo.ObjectId().toHexString(),
    price: 100,
    title: 'Concert',
    userId: '1',
    version: 0
  };

  // @ts-ignore
  const messageMock: Message = {
    ack: jest.fn()
  };

  return [listener, eventDataMock, messageMock];
};

describe('TicketCreated listener', () => {
  it('creates and saves a ticket', async () => {
    const [listener, eventData, message] = await setup();
    await listener.onMessage(eventData, message);

    const ticket = await Ticket.findById(eventData.id);

    expect(ticket).toBeDefined();
    expect(ticket!.title).toEqual(eventData.title);
    expect(ticket!.price).toEqual(eventData.price);
  });

  it('acks the message', async () => {
    const [listener, eventData, message] = await setup();
    await listener.onMessage(eventData, message);

    expect(message.ack).toHaveBeenCalled();
  });
});
