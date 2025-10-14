import request from 'supertest';
import { app } from './setup';

describe('Authentication System', () => {
  it('handles signup request', async () => {
    const email = 'test6@akl.de';
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email: email, password: 'asdf' })
      .expect(201)
      .then((res) => {
        const { id, email } = res.body;
        expect(id).toBeDefined();
        expect(email).toEqual(email);
        expect(res.headers['set-cookie']).toBeDefined();
      });
  });

  it('signup as a new user then get the currently logged in user', async () => {
    const email = 'asdf@akl.de';
    const res = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email: email, password: 'asdf' })
      .expect(201);

    const cookie: string[] = res.get('Set-Cookie')!;

    const { body } = await request(app.getHttpServer())
      .get('/auth/whoami')
      .set('Cookie', cookie)
      .expect(200);

    expect(body.email).toEqual(email);
  });
});
