import { currentUser, errorHandler, NotFoundError } from '@drrtickets/common';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import express, { Request } from 'express';
import 'express-async-errors';
import { createTicketRouter } from './routes/create-ticket.route';
import { getTicketRouter } from './routes/get-ticket.route';
import { getTicketsRouter } from './routes/get-tickets.route';
import { updateTicketRouter } from './routes/update-ticket.route';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test'
  })
);
app.use(currentUser);

app.use(createTicketRouter);
app.use(getTicketRouter);
app.use(getTicketsRouter);
app.use(updateTicketRouter);

app.all('*', async (req: Request) => {
  throw new NotFoundError(req.method, req.path);
});

app.use(errorHandler);

export { app };
