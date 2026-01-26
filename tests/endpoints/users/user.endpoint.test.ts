import { server } from '../../../src/index.js';
import request from 'supertest';
import { StatusCodes } from 'http-status-codes';
import { describe, it, beforeAll, afterAll } from '@jest/globals';


describe('/users', () => {

  let username: string;

  beforeAll(async () => {
    username = `bobby_${Date.now()}_${Math.random().toString(16).slice(2)}`;
  });


  it('POST /users', async () => {
    const res1 = await request(server.app)
      .post('/users')
      .send({ username, password: 'bobby' })
      .set('Content-Type', 'application/json');
    expect(res1.status).toBe(StatusCodes.CREATED);
    expect(res1.body.id).toBeDefined();
    expect(res1.body.username).toBe(username);
  });


  it('GET /users/:username', async () => {
    const res1 = await request(server.app).get(`/users/${username}`);
    expect(res1.status).toBe(StatusCodes.OK);
    expect(res1.body.id).toBeDefined();
    expect(res1.body.username).toBe(username);
  });


  it('DELETE /users/:username', async () => {
    const res1 = await request(server.app).delete(`/users/${username}`);
    expect(res1.status).toBe(StatusCodes.OK);
    expect(res1.body.removedCount).toBe(1);
  });

  afterAll(async () => {
    // DB connection closed globally by Jest setup
  });
});


