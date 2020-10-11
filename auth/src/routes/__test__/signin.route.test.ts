import request from 'supertest';
import { app } from '../../app';

describe('/api/user/signin', () => {
  const endpoint = '/api/users/signin';

  it('returns a 400 with an invalid email', async () => {
    const { body } = await request(app)
      .post(endpoint)
      .send({ email: 'invalid email', password: 'password' })
      .expect(400);

    expect(body).toHaveProperty('errors');
    expect(body.errors).toHaveLength(1);
    expect(body.errors[0]).toHaveProperty('field');
    expect(body.errors[0].field).toEqual('email');
  });

  it('returns a 400 with an empty password', async () => {
    const { body } = await request(app)
      .post(endpoint)
      .send({ email: 'test@test.com', password: '' })
      .expect(400);

    expect(body).toHaveProperty('errors');
    expect(body.errors).toHaveLength(1);
    expect(body.errors[0]).toHaveProperty('field');
    expect(body.errors[0].field).toEqual('password');
  });

  it('returns a 400 with missing email or password', async () => {
    await request(app)
      .post(endpoint)
      .send({ email: 'test@test.com' })
      .expect(400);

    await request(app)
      .post(endpoint)
      .send({ password: 'password' })
      .expect(400);
  });

  it('fails when an email that does not exist is supplied', async () => {
    const { body } = await request(app)
      .post(endpoint)
      .send({ email: 'test@test.com', password: 'password' })
      .expect(400);

    expect(body.errors).toBeDefined();
    expect(body.errors).toHaveLength(1);
    expect(body.errors[0].message).toBeDefined();
    expect(body.errors[0].message).toMatch(/invalid credentials/i);
  });

  it('fails when an incorrect password is supplied', async () => {
    await request(app)
      .post('/api/users/signup')
      .send({ email: 'test@test.com', password: 'password' })
      .expect(201);

    const { body } = await request(app)
      .post(endpoint)
      .send({ email: 'test@test.com', password: 'incorrect' })
      .expect(400);

    expect(body.errors).toBeDefined();
    expect(body.errors).toHaveLength(1);
    expect(body.errors[0].message).toBeDefined();
    expect(body.errors[0].message).toMatch(/invalid credentials/i);
  });

  it('responds with a cookie when given valid credentials', async () => {
    await request(app)
      .post('/api/users/signup')
      .send({ email: 'test@test.com', password: 'password' })
      .expect(201);

    const response = await request(app)
      .post(endpoint)
      .send({ email: 'test@test.com', password: 'password' })
      .expect(200);

    expect(response.get('Set-Cookie')).toBeDefined();
  });
});
