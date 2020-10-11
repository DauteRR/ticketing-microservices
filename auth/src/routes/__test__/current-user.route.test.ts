import request from 'supertest';
import { app } from '../../app';

describe('/api/users/currentuser', () => {
  const endpoint = '/api/users/currentuser';

  it('responds with details about the current user', async () => {
    const user = { email: 'test@test.com', password: 'password' };

    const cookie = await global.getAuthCookie(user.email, user.password);

    const { body } = await request(app)
      .get(endpoint)
      .set('Cookie', cookie)
      .send()
      .expect(200);

    expect(body.currentUser).not.toBeNull();
    expect(body.currentUser.email).toEqual(user.email);
  });

  it('responds with null if not authenticated', async () => {
    const { body } = await request(app).get(endpoint).send().expect(200);

    expect(body.currentUser).toBeNull();
  });
});
