import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket.model';
import { natsWrapper } from '../../nats-wrapper';

const createTicket = (
  title?: string,
  price?: number,
  email?: string,
  auth: boolean = true
) =>
  request(app)
    .post('/api/tickets')
    .set(
      'Cookie',
      auth ? global.getAuthCookie(email ? email : 'test@test.com') : []
    )
    .send({ title, price });

const getTicket = async (id: string) => {
  return await request(app).get(`/api/tickets/${id}`).send({}).expect(200);
};

describe('POST /api/tickets', () => {
  it('has a route handler listening to /api/tickets [POST]', async () => {
    const response = await createTicket('title', 10);
    expect(response.status).not.toEqual(404);
  });

  it('can only be accessed if the user is signed in', async () => {
    await createTicket('title', 10, undefined, false).expect(401);
  });

  it('returns a status other than 401 if the user is signed in', async () => {
    const response = await createTicket('title', 10);
    expect(response.status).not.toEqual(401);
  });

  it('returns an error if an invalid title is provided', async () => {
    await createTicket('', 10).expect(400);
    await createTicket(undefined, 10).expect(400);
  });

  it('returns an error if an invalid price is provided', async () => {
    await createTicket('title', -10).expect(400);
    await createTicket('title').expect(400);
  });

  it('creates a ticket with valid inputs', async () => {
    const newTicket = {
      title: 'Title',
      price: 22
    };
    let tickets = await Ticket.find({});
    expect(tickets.length).toEqual(0);

    await createTicket(newTicket.title, newTicket.price).expect(201);

    tickets = await Ticket.find({});
    expect(tickets.length).toEqual(1);
    expect(tickets[0].title).toEqual(newTicket.title);
    expect(tickets[0].price).toEqual(newTicket.price);
  });

  it('publishes an event', async () => {
    const newTicket = {
      title: 'Title',
      price: 22
    };
    let tickets = await Ticket.find({});
    expect(tickets.length).toEqual(0);

    await createTicket(newTicket.title, newTicket.price).expect(201);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
  });
});

describe('GET /api/tickets', () => {
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

describe('GET /api/tickets/:id', () => {
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

describe('PUT /api/tickets/:id', () => {
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
