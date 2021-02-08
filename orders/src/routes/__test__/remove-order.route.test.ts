import { OrderStatus, Subject } from '@drrtickets/common';
import request from 'supertest';
import { app } from '../../app';
import { Order } from '../../models/order.model';
import { Ticket } from '../../models/ticket.model';
import { natsWrapper } from '../../nats-wrapper';

describe('Order cancellation: Delete /api/orders/:id', () => {
  it('marks an order as cancelled', async () => {
    const ticket = Ticket.build({
      title: 'concert',
      price: 100
    });
    await ticket.save();

    const user = global.getAuthCookie('test@test.com');

    const { body: order } = await request(app)
      .post('/api/orders')
      .set('Cookie', user)
      .send({ ticketId: ticket.id })
      .expect(201);

    const response = await request(app)
      .delete(`/api/orders/${order.id}`)
      .set('Cookie', user)
      .send()
      .expect(204);

    const updatedOrder = await Order.findById(order.id);
    expect(updatedOrder!.status).toEqual(OrderStatus.Canceled);
  });

  it('emits an order canceled event', async () => {
    const ticket = Ticket.build({
      title: 'concert',
      price: 100
    });
    await ticket.save();

    const user = global.getAuthCookie('test@test.com');

    const { body: order } = await request(app)
      .post('/api/orders')
      .set('Cookie', user)
      .send({ ticketId: ticket.id })
      .expect(201);

    const response = await request(app)
      .delete(`/api/orders/${order.id}`)
      .set('Cookie', user)
      .send()
      .expect(204);

    const updatedOrder = await Order.findById(order.id);
    expect(updatedOrder!.status).toEqual(OrderStatus.Canceled);

    expect(natsWrapper.client.publish).toHaveBeenCalledWith(
      Subject.OrderCanceled,
      expect.anything(),
      expect.anything()
    );
  });
});
