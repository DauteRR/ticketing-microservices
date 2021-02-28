import { OrderCanceledEventData, OrderStatus } from '@drrtickets/common';
import { mongo } from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Order } from '../../models/order';
import { natsWrapper } from '../../nats-wrapper';
import { OrderCanceledListener } from '../order-canceled.listener';

const setup = async (): Promise<
  [OrderCanceledListener, OrderCanceledEventData, Message]
> => {
  const listener = new OrderCanceledListener(natsWrapper.client);

  const order = Order.build(new mongo.ObjectId().toHexString(), {
    price: 100,
    status: OrderStatus.Created,
    userId: '2313',
    version: 0
  });
  await order.save();

  const eventDataMock: OrderCanceledEventData = {
    id: order.id,
    ticket: {
      id: new mongo.ObjectId().toHexString()
    },
    version: 1
  };

  // @ts-ignore
  const messageMock: Message = {
    ack: jest.fn()
  };

  return [listener, eventDataMock, messageMock];
};

describe('OrderCanceled listener', () => {
  it('updates the status of the order', async () => {
    const [listener, eventData, message] = await setup();
    await listener.onMessage(eventData, message);

    const order = await Order.findById(eventData.id);

    expect(order).toBeDefined();
    expect(order!.status).toEqual(OrderStatus.Canceled);
  });

  it('acks the message', async () => {
    const [listener, eventData, message] = await setup();
    await listener.onMessage(eventData, message);

    expect(message.ack).toHaveBeenCalled();
  });
});
