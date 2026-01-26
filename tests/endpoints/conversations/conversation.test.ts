import { server } from '../../../src/index.js';
import request from 'supertest';
import { StatusCodes } from 'http-status-codes';
import { describe, it, beforeAll, afterAll } from '@jest/globals';


describe('/conversations', () => {

  let userId: number;
  let username: string;
  let conversationId: number;

  beforeAll(async () => {
    username = `bobby_${Date.now()}_${Math.random().toString(16).slice(2)}`;
    const resUser = await request(server.app)
      .post('/users')
      .send({ username, password: 'bobby' })
      .set('Content-Type', 'application/json');

    userId = resUser.body.id;
  });

  
  it('POST /conversations', async () => {   
    const res1 = await request(server.app)
      .post('/conversations')
      .send({ user_id: userId, title: 'conversation de bobby' })
      .set('Content-Type', 'application/json');
    conversationId = res1.body.id;

    expect(res1.status).toBe(StatusCodes.CREATED);
    expect(res1.body.id).toBeDefined();
    expect(res1.body.title).toBe('conversation de bobby');
    expect(res1.body.user_id).toBe(userId);
  });


  it('GET /users/:userId/conversation', async () => {
    const res1 = await request(server.app).get(`/users/${userId}/conversations`);
    expect(res1.status).toBe(StatusCodes.OK);
    expect(res1.body.length).toBe(1);
    expect(res1.body[0].id).toBe(conversationId);
    expect(res1.body[0].title).toBe('conversation de bobby');
    expect(res1.body[0].user_id).toBe(userId);
  });


  it('DELETE /conversations/', async () => {   
    const res1 = await request(server.app).delete(`/conversations/${conversationId}`);
    expect(res1.status).toBe(StatusCodes.OK);
  });

  afterAll(async () => {
    await request(server.app).delete(`/users/${username}`);
    // DB connection closed globally by Jest setup
  });
});


