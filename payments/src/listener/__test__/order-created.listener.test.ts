import { OrderCreatedEventData, OrderStatus } from '@drrtickets/common';
import { mongo } from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Order } from '../../models/order';
import { natsWrapper } from '../../nats-wrapper';
import { OrderCreatedListener } from '../order-created.listener';

const setup = async (): Promise<
  [OrderCreatedListener, OrderCreatedEventData, Message]
> => {
  const listener = new OrderCreatedListener(natsWrapper.client);

  const eventDataMock: OrderCreatedEventData = {
    id: new mongo.ObjectId().toHexString(),
    expiresAt: '',
    status: OrderStatus.Created,
    ticket: {
      id: new mongo.ObjectId().toHexString(),
      price: 120
    },
    userId: '23123',
    version: 0
  };

  // @ts-ignore
  const messageMock: Message = {
    ack: jest.fn()
  };

  return [listener, eventDataMock, messageMock];
};

describe('OrderCreated listener', () => {
  it('creates and saves an order', async () => {
    const [listener, eventData, message] = await setup();
    await listener.onMessage(eventData, message);

    const order = await Order.findById(eventData.id);

    expect(order).toBeDefined();
    expect(order!.price).toEqual(eventData.ticket.price);
    expect(order!.status).toEqual(eventData.status);
  });

  it('acks the message', async () => {
    const [listener, eventData, message] = await setup();
    await listener.onMessage(eventData, message);

    expect(message.ack).toHaveBeenCalled();
  });
});
