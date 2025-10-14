import request from 'supertest';
import { app } from './setup';

describe('AppController (e2e)', () => {
  it('/ (GET) => expect forbidden', () => {
    return request(app.getHttpServer()).get('/').expect(403);
  });
});
