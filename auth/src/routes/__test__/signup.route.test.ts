import request from 'supertest';
import { app } from '../../app';

describe('/api/users/signup', () => {
  const endpoint = '/api/users/signup';

  it('returns a 201 on successfull signup', async () => {
    return request(app)
      .post(endpoint)
      .send({ email: 'test@test.com', password: 'password' })
      .expect(201);
  });

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

  it('returns a 400 with an invalid password', async () => {
    const { body } = await request(app)
      .post(endpoint)
      .send({ email: 'test@test.com', password: '1' })
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

  it('disallows duplicate emails', async () => {
    const newUser = { email: 'test@test.com', password: 'password' };

    await request(app).post(endpoint).send(newUser).expect(201);

    await request(app).post(endpoint).send(newUser).expect(400);
  });

  it('sets a cookie after successful signup', async () => {
    const response = await request(app)
      .post(endpoint)
      .send({ email: 'test@test.com', password: 'password' })
      .expect(201);

    expect(response.get('Set-Cookie')).toBeDefined();
  });
});
