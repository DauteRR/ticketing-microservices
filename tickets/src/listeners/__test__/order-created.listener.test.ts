import { OrderCreatedEventData, OrderStatus } from '@drrtickets/common';
import { mongo } from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../models/ticket.model';
import { natsWrapper } from '../../nats-wrapper';
import { OrderCreatedListener } from '../order-created.listener';

const setup = async (): Promise<
  [OrderCreatedListener, OrderCreatedEventData, Message]
> => {
  const listener = new OrderCreatedListener(natsWrapper.client);

  const ticket = Ticket.build({
    price: 100,
    title: 'Concert',
    userId: '123'
  });
  await ticket.save();

  const eventDataMock: OrderCreatedEventData = {
    id: new mongo.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    userId: '321',
    expiresAt: '',
    ticket: {
      id: ticket.id,
      price: ticket.price
    }
  };

  // @ts-ignore
  const messageMock: Message = {
    ack: jest.fn()
  };

  return [listener, eventDataMock, messageMock];
};

describe('OrderCreated listener', () => {
  it('updates orderId ticket property', async () => {
    const [listener, eventData, message] = await setup();
    await listener.onMessage(eventData, message);

    const ticket = await Ticket.findById(eventData.ticket.id);

    expect(ticket).toBeDefined();
    expect(ticket!.orderId).toEqual(eventData.id);
  });

  it('acks the message', async () => {
    const [listener, eventData, message] = await setup();
    await listener.onMessage(eventData, message);

    expect(message.ack).toHaveBeenCalled();
  });

  it('publishes a ticket updated event', async () => {
    const [listener, eventData, message] = await setup();
    await listener.onMessage(eventData, message);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
    const ticketUpdatedData = JSON.parse(
      (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
    );
    expect(eventData.id).toEqual(ticketUpdatedData.orderId);
  });
});
