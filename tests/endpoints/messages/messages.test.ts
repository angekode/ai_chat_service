import { server } from '../../../src/index.js';
import request from 'supertest';
import { StatusCodes } from 'http-status-codes';
import { describe, it, beforeAll, afterAll } from '@jest/globals';


describe('/messages', () => {

  let userId: number;
  let conversationId: number;
  let messageId: number;
  let username: string;

  beforeAll(async () => {
    username = `Bob_${Date.now()}_${Math.random().toString(16).slice(2)}`;
    const userRes = await request(server.app)
      .post('/users')
      .set('Content-Type','application/json')
      .send({ username, password: 'Bod' });
    userId = userRes.body.id;

    const res = await request(server.app)
      .post('/conversations')
      .set('Content-Type', 'application/json')
      .send({ user_id: userId, title: 'Conversation de Bob' });
    conversationId = res.body.id;
  });


  it('POST /conversations/:conversationId/messages', async () => {
    const res = await request(server.app)
    .post(`/conversations/${conversationId}/messages`)
    .set('Content-Type', 'application/json')
    .send({
      role: 'user',
      content: 'question'
    });
    expect(res.status).toBe(StatusCodes.CREATED);
    expect(res.body).toBeDefined();
    expect(isNaN(Number(res.body.id))).toBeFalsy();
    messageId = res.body.id;
  });


  it('DELETE /messages/:messageId', async () => {
    const res = await request(server.app)
    .delete(`/messages/${messageId}`);

    expect(res.status).toBe(StatusCodes.OK);
    expect(res.body).toBeDefined();
  });

  afterAll(async () => {
    await request(server.app).delete(`/users/${username}`);
    // DB connection closed globally by Jest setup
  });
});



