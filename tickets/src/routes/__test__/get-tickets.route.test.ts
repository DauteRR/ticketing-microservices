import request from 'supertest';
import { app } from '../../app';
import { createTicket } from './create-ticket.route.test';

describe('Tickets retrieval: GET /api/tickets', () => {
  const endpoint = '/api/tickets';

  it('has a route handler listening to /api/tickets [GET]', async () => {
    const response = await request(app).get(endpoint).send({});
    expect(response.status).not.toEqual(404);
  });

  it('can fetch a list of tickets', async () => {
    const response = await request(app).get(endpoint).send({});
    expect(response.body.length).toEqual(0);

    await Promise.all([
      createTicket('title 1', 1).expect(201),
      createTicket('title 2', 2).expect(201),
      createTicket('title 3', 3).expect(201),
      createTicket('title 4', 4).expect(201)
    ]);

    const { body } = await request(app).get(endpoint).send({});
    expect(body.length).toEqual(4);
  });
});
