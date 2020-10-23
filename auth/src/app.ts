import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import express, { Request } from 'express';
import 'express-async-errors';
import { NotFoundError, errorHandler } from '@drrtickets/common';
import { currentUserRouter } from './routes/current-user.route';
import { signinRouter } from './routes/signin.route';
import { signoutRouter } from './routes/signout.route';
import { signupRouter } from './routes/signup.route';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test'
  })
);

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

app.all('*', async (req: Request) => {
  throw new NotFoundError(req.method, req.path);
});

app.use(errorHandler);

export { app };
