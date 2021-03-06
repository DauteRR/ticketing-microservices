import { currentUser, errorHandler, NotFoundError } from '@drrtickets/common';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import express, { Request } from 'express';
import 'express-async-errors';
import { createChargeRouter } from './routes/create-charge.route';

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

app.use(createChargeRouter);

app.all('*', async (req: Request) => {
  throw new NotFoundError(req.method, req.path);
});

app.use(errorHandler);

export { app };
