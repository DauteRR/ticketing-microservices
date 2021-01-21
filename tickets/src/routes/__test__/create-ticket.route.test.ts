import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket.model';
import { natsWrapper } from '../../nats-wrapper';

export const createTicket = (
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

describe('Ticket creation: POST /api/tickets', () => {
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
