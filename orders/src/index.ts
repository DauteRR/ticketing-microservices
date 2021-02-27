import mongoose from 'mongoose';
import { app } from './app';
import { ExpirationCompleteListener } from './listener/expiration-complete.listener';
import { TicketCreatedListener } from './listener/ticket-created.listener';
import { TicketUpdatedListener } from './listener/ticket-updated.listener';
import { natsWrapper } from './nats-wrapper';

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY environment variable must be defined');
  }
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI environment variable must be defined');
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error('NATS_CLUSTER_ID environment variable must be defined');
  }
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error('NATS_CLIENT_ID environment variable must be defined');
  }
  if (!process.env.NATS_URL) {
    throw new Error('NATS_URL environment variable must be defined');
  }

  try {
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );

    natsWrapper.client.on('close', () => {
      console.log('NATS connection closed');
      process.exit();
    });
    process.on('SIGINT', () => natsWrapper.client.close());
    process.on('SIGTERM', () => natsWrapper.client.close());

    const ticketCreatedListener = new TicketCreatedListener(natsWrapper.client);
    const ticketUpdatedListener = new TicketUpdatedListener(natsWrapper.client);
    const expirationCompleteListener = new ExpirationCompleteListener(
      natsWrapper.client
    );

    ticketCreatedListener.listen();
    ticketUpdatedListener.listen();
    expirationCompleteListener.listen();

    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    });
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error(err);
  }

  app.listen(3000, () => {
    console.log('Listening on port 3000');
  });
};

start();
