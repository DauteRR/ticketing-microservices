import request from 'supertest';
import { app } from '../../app';
import { createTicket } from './create-ticket.route.test';

export const getTicket = async (id: string) => {
  return await request(app).get(`/api/tickets/${id}`).send({}).expect(200);
};

describe('Specific ticket retrieval: GET /api/tickets/:id', () => {
  const baseEndpoint = '/api/tickets';

  it('returns a 404 if the ticket is not found', async () => {
    await request(app)
      .get(`${baseEndpoint}/5f95a1471a431118c6b4fd0f`)
      .send()
      .expect(404);
  });

  it('returns an error if the given id is not a mongo id', async () => {
    await request(app).get(`${baseEndpoint}/invalid_id`).send().expect(400);
  });

  it('returns the ticket if the ticket is found', async () => {
    const newTicket = {
      title: 'Title',
      price: 22
    };

    const response = await createTicket(
      newTicket.title,
      newTicket.price
    ).expect(201);

    const { body } = await getTicket(response.body.id);
    expect(body.title).toEqual(newTicket.title);
    expect(body.price).toEqual(newTicket.price);
  });
});
