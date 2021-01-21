import request from 'supertest';
import { app } from '../../app';
import { natsWrapper } from '../../nats-wrapper';
import { createTicket } from './create-ticket.route.test';
import { getTicket } from './get-ticket.route.test';

describe('Ticket update: PUT /api/tickets/:id', () => {
  const baseEndpoint = '/api/tickets';

  it('returns a 401 if the user is not authenticated', async () => {
    await request(app)
      .put(`${baseEndpoint}/5f95a1471a431118c6b4fd0f`)
      .send({ title: 'new title' })
      .expect(401);
  });

  it('returns a 401 if the user does not own the ticket', async () => {
    const ticket = {
      title: 'title',
      price: 10
    };
    const {
      body: { id }
    } = await createTicket(ticket.title, ticket.price, 'test1@test.com').expect(
      201
    );

    await request(app)
      .put(`${baseEndpoint}/${id}`)
      .set('Cookie', global.getAuthCookie('test2@test.com'))
      .send({ title: 'new title', price: 20 })
      .expect(401);

    const { body } = await getTicket(id);

    expect(body.price).toEqual(ticket.price);
    expect(body.title).toEqual(ticket.title);
  });

  it('returns a 400 if the user provides invalid params', async () => {
    const {
      body: { id }
    } = await createTicket('title', 10, 'test@test.com').expect(201);

    await request(app)
      .put(`${baseEndpoint}/${id}`)
      .set('Cookie', global.getAuthCookie('test@test.com'))
      .send({ title: '' })
      .expect(400);

    await request(app)
      .put(`${baseEndpoint}/${id}`)
      .set('Cookie', global.getAuthCookie('test@test.com'))
      .send({ price: -12 })
      .expect(400);
  });

  it('returns a 404 if the ticket is not found', async () => {
    await request(app)
      .put(`${baseEndpoint}/5f95a1471a431118c6b4fd0f`)
      .set('Cookie', global.getAuthCookie('test@test.com'))
      .send({ title: 'new title' })
      .expect(404);
  });

  it('returns an error if the given id is not a mongo id', async () => {
    await request(app)
      .put(`${baseEndpoint}/invalid-id`)
      .set('Cookie', global.getAuthCookie('test@test.com'))
      .send({ title: 'new title' })
      .expect(400);
  });

  it('updates the ticket price when a valid value is provided', async () => {
    const title = 'title';
    let price = 20;
    const {
      body: { id }
    } = await createTicket(title, price, 'test1@test.com').expect(201);
    price = 10;
    await request(app)
      .put(`${baseEndpoint}/${id}`)
      .set('Cookie', global.getAuthCookie('test1@test.com'))
      .send({ price })
      .expect(200);
    const { body } = await getTicket(id);
    expect(body.price).toEqual(price);
  });

  it('updates the ticket title when a valid value is provided', async () => {
    let title = 'title';
    const price = 20;
    const {
      body: { id }
    } = await createTicket(title, price, 'test1@test.com').expect(201);
    title = 'new title';
    await request(app)
      .put(`${baseEndpoint}/${id}`)
      .set('Cookie', global.getAuthCookie('test1@test.com'))
      .send({ title })
      .expect(200);
    const { body } = await getTicket(id);
    expect(body.title).toEqual(title);
  });

  it('updates the ticket when valid params are provided', async () => {
    let title = 'title';
    let price = 20;
    const {
      body: { id }
    } = await createTicket(title, price, 'test1@test.com').expect(201);
    title = 'new title';
    price = 1000;
    await request(app)
      .put(`${baseEndpoint}/${id}`)
      .set('Cookie', global.getAuthCookie('test1@test.com'))
      .send({ title, price })
      .expect(200);
    const { body } = await getTicket(id);
    expect(body.title).toEqual(title);
    expect(body.price).toEqual(price);
  });

  it('publishes an event', async () => {
    let title = 'title';
    let price = 20;
    const {
      body: { id }
    } = await createTicket(title, price, 'test1@test.com').expect(201);
    title = 'new title';
    price = 1000;
    await request(app)
      .put(`${baseEndpoint}/${id}`)
      .set('Cookie', global.getAuthCookie('test1@test.com'))
      .send({ title, price })
      .expect(200);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
  });
});
