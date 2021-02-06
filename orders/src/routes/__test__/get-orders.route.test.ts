import request from 'supertest';
import { app } from '../../app';
import { Order, OrderDocument } from '../../models/order.model';
import { Ticket, TicketDocument } from '../../models/ticket.model';

const buildTicket = async (): Promise<TicketDocument> => {
  const ticket = Ticket.build({
    price: 1000,
    title: 'concert'
  });

  await ticket.save();

  return ticket;
};

describe('Orders retrieval: GET /api/orders', () => {
  it('fetches orders for an particular user', async () => {
    const ticketOne = await buildTicket();
    const ticketTwo = await buildTicket();
    const ticketThree = await buildTicket();
    const userOne = global.getAuthCookie('test1@test.com');
    const userTwo = global.getAuthCookie('test2@test.com');

    await request(app)
      .post('/api/orders')
      .set('Cookie', userOne)
      .send({ ticketId: ticketOne.id })
      .expect(201);

    const { body: orderOne } = await request(app)
      .post('/api/orders')
      .set('Cookie', userTwo)
      .send({ ticketId: ticketTwo.id })
      .expect(201);

    const { body: orderTwo } = await request(app)
      .post('/api/orders')
      .set('Cookie', userTwo)
      .send({ ticketId: ticketThree.id })
      .expect(201);

    const response = await request(app)
      .get('/api/orders')
      .set('Cookie', userTwo)
      .expect(200);

    expect(response.body).toHaveLength(2);
    const ticketIds = response.body.map(
      (order: OrderDocument) => order.ticket.id
    );
    expect(ticketIds).not.toContain(ticketOne.id);
    expect(ticketIds).toContain(ticketTwo.id);
    expect(ticketIds).toContain(ticketThree.id);
    const orderIds = response.body.map((order: OrderDocument) => order.id);
    expect(orderIds).toContain(orderOne.id);
    expect(orderIds).toContain(orderTwo.id);
  });
});
