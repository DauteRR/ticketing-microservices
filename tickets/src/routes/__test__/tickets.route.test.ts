import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket.model';

describe('POST /api/tickets', () => {
  const endpoint = '/api/tickets';

  it('has a route handler listening to /api/tickets [POST]', async () => {
    const response = await request(app).post(endpoint).send({});

    expect(response.status).not.toEqual(404);
  });

  it('can only be accessed if the user is signed in', async () => {
    await request(app).post(endpoint).send({}).expect(401);
  });

  it('returns a status other than 401 if the user is signed in', async () => {
    const authCookie = global.getAuthCookie('test@test.com', 'pass');
    const response = await request(app)
      .post(endpoint)
      .set('Cookie', authCookie)
      .send({});

    expect(response.status).not.toEqual(401);
  });

  it('returns an error if an invalid title is provided', async () => {
    const authCookie = global.getAuthCookie('test@test.com', 'pass');
    await request(app)
      .post(endpoint)
      .set('Cookie', authCookie)
      .send({
        title: '',
        price: 10
      })
      .expect(400);
    await request(app)
      .post(endpoint)
      .set('Cookie', authCookie)
      .send({
        price: 10
      })
      .expect(400);
  });

  it('returns an error if an invalid price is provided', async () => {
    const authCookie = global.getAuthCookie('test@test.com', 'pass');
    await request(app)
      .post(endpoint)
      .set('Cookie', authCookie)
      .send({
        title: 'Title',
        price: -10
      })
      .expect(400);
    await request(app)
      .post(endpoint)
      .set('Cookie', authCookie)
      .send({
        title: 'Title'
      })
      .expect(400);
  });

  it('creates a ticket with valid inputs', async () => {
    const newTicket = {
      title: 'Title',
      price: 22
    };
    let tickets = await Ticket.find({});
    expect(tickets.length).toEqual(0);

    const authCookie = global.getAuthCookie('test@test.com', 'pass');
    await request(app)
      .post(endpoint)
      .set('Cookie', authCookie)
      .send(newTicket)
      .expect(201);

    tickets = await Ticket.find({});
    expect(tickets.length).toEqual(1);
    expect(tickets[0].title).toEqual(newTicket.title);
    expect(tickets[0].price).toEqual(newTicket.price);
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

    const authCookie = global.getAuthCookie('test@test.com', 'pass');
    const response = await request(app)
      .post(baseEndpoint)
      .set('Cookie', authCookie)
      .send(newTicket)
      .expect(201);

    const { body } = await request(app)
      .get(`${baseEndpoint}/${response.body.id}`)
      .send()
      .expect(200);
    expect(body.title).toEqual(newTicket.title);
    expect(body.price).toEqual(newTicket.price);
  });
});
