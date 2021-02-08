import request from 'supertest';
import { app } from '../../app';
import { Order, OrderStatus } from '../../models/order.model';
import { Ticket } from '../../models/ticket.model';
import mongoose from 'mongoose';
import { natsWrapper } from '../../nats-wrapper';
import { Subject } from '@drrtickets/common';

describe('Orders creation: POST /api/orders', () => {
  it('returns an error if the ticket does not exist', async () => {
    const ticketId = mongoose.Types.ObjectId();

    await request(app)
      .post('/api/orders')
      .set('Cookie', global.getAuthCookie('test@test.com'))
      .send({ ticketId })
      .expect(404);
  });

  it('returns an error if the ticket is already reserved', async () => {
    const ticket = Ticket.build({
      price: 100,
      title: 'concert'
    });
    await ticket.save();

    const order = Order.build({
      ticket,
      userId: 'id',
      expiresAt: new Date(),
      status: OrderStatus.Created
    });
    await order.save();

    await request(app)
      .post('/api/orders')
      .set('Cookie', global.getAuthCookie('test@test.com'))
      .send({ ticketId: ticket.id })
      .expect(400);
  });

  it('reserves a ticket', async () => {
    const ticket = Ticket.build({
      price: 100,
      title: 'concert'
    });
    await ticket.save();

    await request(app)
      .post('/api/orders')
      .set('Cookie', global.getAuthCookie('test@test.com'))
      .send({ ticketId: ticket.id })
      .expect(201);
  });

  it('emits an order created event', async () => {
    const ticket = Ticket.build({
      price: 100,
      title: 'concert'
    });
    await ticket.save();

    await request(app)
      .post('/api/orders')
      .set('Cookie', global.getAuthCookie('test@test.com'))
      .send({ ticketId: ticket.id })
      .expect(201);

    expect(natsWrapper.client.publish).toHaveBeenCalledWith(
      Subject.OrderCreated,
      expect.anything(),
      expect.anything()
    );
  });
});
