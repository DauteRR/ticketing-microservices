import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket.model';

describe('Specific order retrieval: GET /api/orders/:id', () => {
  it('fetches the order', async () => {
    const ticket = Ticket.build({
      price: 100,
      title: 'concert'
    });
    await ticket.save();

    const user = global.getAuthCookie('test@test.com');

    const { body: order } = await request(app)
      .post('/api/orders')
      .set('Cookie', user)
      .send({ ticketId: ticket.id })
      .expect(201);

    const response = await request(app)
      .get(`/api/orders/${order.id}`)
      .set('Cookie', user)
      .send()
      .expect(200);

    expect(response.body).toEqual(order);
  });

  it('returns an error if one user tries to fetch another users order', async () => {
    const ticket = Ticket.build({
      price: 100,
      title: 'concert'
    });
    await ticket.save();

    const user = global.getAuthCookie('test1@test.com');
    const imposter = global.getAuthCookie('test2@test.com');

    const { body: order } = await request(app)
      .post('/api/orders')
      .set('Cookie', user)
      .send({ ticketId: ticket.id })
      .expect(201);

    await request(app)
      .get(`/api/orders/${order.id}`)
      .set('Cookie', imposter)
      .send()
      .expect(401);
  });
});
