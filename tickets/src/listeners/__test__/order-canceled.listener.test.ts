import { OrderCanceledEventData, OrderStatus } from '@drrtickets/common';
import { mongo } from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../models/ticket.model';
import { natsWrapper } from '../../nats-wrapper';
import { OrderCanceledListener } from '../order-canceled.listener';

const setup = async (): Promise<
  [OrderCanceledListener, OrderCanceledEventData, Message]
> => {
  const listener = new OrderCanceledListener(natsWrapper.client);

  const orderId = new mongo.ObjectId().toHexString();
  const ticket = Ticket.build({
    price: 100,
    title: 'Concert',
    userId: '123'
  });
  ticket.set({ orderId: orderId });
  await ticket.save();

  const eventDataMock: OrderCanceledEventData = {
    id: orderId,
    version: 0,
    ticket: {
      id: ticket.id
    }
  };

  // @ts-ignore
  const messageMock: Message = {
    ack: jest.fn()
  };

  return [listener, eventDataMock, messageMock];
};

describe('OrderCanceled listener', () => {
  it('updates orderId ticket property', async () => {
    const [listener, eventData, message] = await setup();
    await listener.onMessage(eventData, message);

    const ticket = await Ticket.findById(eventData.ticket.id);

    expect(ticket).toBeDefined();
    expect(ticket!.orderId).toBeUndefined();
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
    expect(ticketUpdatedData.orderId).toBeUndefined();
  });
});
