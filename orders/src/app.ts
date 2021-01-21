import { currentUser, errorHandler, NotFoundError } from '@drrtickets/common';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import express, { Request } from 'express';
import 'express-async-errors';
import { createOrderRouter } from './routes/create-order.route';
import { getOrderRoute } from './routes/get-order.route';
import { getOrdersRoute } from './routes/get-orders.route';
import { removeOrderRouter } from './routes/remove-order.route';

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

app.use(createOrderRouter);
app.use(getOrderRoute);
app.use(getOrdersRoute);
app.use(removeOrderRouter);

app.all('*', async (req: Request) => {
  throw new NotFoundError(req.method, req.path);
});

app.use(errorHandler);

export { app };
