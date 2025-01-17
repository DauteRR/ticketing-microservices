import jwt from 'jsonwebtoken';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

declare global {
  namespace NodeJS {
    interface Global {
      getAuthCookie(email: string): string[];
    }
  }
}

jest.mock('../nats-wrapper');

let mongo: any;
beforeAll(async () => {
  process.env.JWT_KEY = 'test-key';

  mongo = new MongoMemoryServer();
  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
});

beforeEach(async () => {
  jest.clearAllMocks();
  console.log = jest.fn();
  const collections = await mongoose.connection.db.collections();
  collections.forEach(collection => collection.deleteMany({}));
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

global.getAuthCookie = (email: string) => {
  const payload = {
    id: email,
    email
  };
  const token = jwt.sign(payload, process.env.JWT_KEY!);
  const session = { jwt: token };
  const sessionString = JSON.stringify(session);
  const base64 = Buffer.from(sessionString).toString('base64');

  return [`express:sess=${base64}`];
};
