import request from 'supertest';
import { app } from '../../app';

describe('/api/users/signout', () => {
  const endpoint = '/api/users/signout';

  it('clears the cookie after signing out', async () => {
    await request(app)
      .post('/api/users/signup')
      .send({ email: 'test@test.com', password: 'password' })
      .expect(201);

    const response = await request(app).post(endpoint).send({}).expect(200);

    expect(response.get('Set-Cookie')[0]).toMatch(/sess=;/gi);
  });
});
