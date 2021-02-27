import {
  ExpirationCompleteEventData,
  OrderStatus,
  Subject
} from '@drrtickets/common';
import { mongo } from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Order } from '../../models/order.model';
import { Ticket } from '../../models/ticket.model';
import { natsWrapper } from '../../nats-wrapper';
import { ExpirationCompleteListener } from '../expiration-complete.listener';

const setup = async (): Promise<
  [ExpirationCompleteListener, ExpirationCompleteEventData, Message]
> => {
  const listener = new ExpirationCompleteListener(natsWrapper.client);

  const ticket = Ticket.build(new mongo.ObjectId().toHexString(), {
    title: 'Concert',
    price: 100
  });
  await ticket.save();

  const order = Order.build({
    status: OrderStatus.Created,
    expiresAt: new Date(),
    ticket,
    userId: '123'
  });
  await order.save();

  const eventDataMock: ExpirationCompleteEventData = {
    orderId: order.id
  };

  // @ts-ignore
  const messageMock: Message = {
    ack: jest.fn()
  };

  return [listener, eventDataMock, messageMock];
};

describe('ExpirationComplete listener', () => {
  it('updates order status', async () => {
    const [listener, eventData, message] = await setup();
    await listener.onMessage(eventData, message);

    const order = await Order.findById(eventData.orderId);

    expect(order).toBeDefined();
    expect(order!.status).toEqual(OrderStatus.Canceled);
  });

  it('emits an OrderCanceled event', async () => {
    const [listener, eventData, message] = await setup();
    await listener.onMessage(eventData, message);

    expect(natsWrapper.client.publish).toHaveBeenCalled();

    const [subject, jsonData] = (natsWrapper.client
      .publish as jest.Mock).mock.calls[0];

    expect(subject).toEqual(Subject.OrderCanceled);
    expect(JSON.parse(jsonData).id).toEqual(eventData.orderId);
  });

  it('acks the message', async () => {
    const [listener, eventData, message] = await setup();
    await listener.onMessage(eventData, message);

    expect(message.ack).toHaveBeenCalled();
  });
});
