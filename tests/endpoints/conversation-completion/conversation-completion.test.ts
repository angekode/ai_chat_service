import { server } from '../../../src/index.js';
import request from 'supertest';
import { StatusCodes } from 'http-status-codes';
import { describe, it, beforeAll, afterAll } from '@jest/globals';


describe('/conversations/:conversationId/messages:complete', () => {

  let userId: number;
  let conversationId: number;
  let username: string;

  beforeAll(async () => {
    username = `bobby_${Date.now()}_${Math.random().toString(16).slice(2)}`;
    const resUser = await request(server.app)
      .post('/users')
      .send({ username, password: 'bobby' })
      .set('Content-Type', 'application/json');
    userId = resUser.body.id;

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


  it('POST /conversations/:conversationId/messages:complete (single)', async () => {  
    const res = await request(server.app)
      .post(`/conversations/${conversationId}/messages:complete`)
      .send({ 
        messages: [{ role: 'user', content: 'Quelle est la couleur du ciel en un mot ?'}],
        stream: false 
      })
      .set('Content-Type', 'application/json');
    
      expect(res.status).toBe(StatusCodes.OK);
      expect(res.body.choices[0].message.role).toBe('assistant');
      expect(typeof res.body.choices[0].message.content).toBe('string');
  });


  it('GET /conversations/:conversationId/messages', async () => {  
    const res = await request(server.app).get(`/conversations/${conversationId}/messages`);
    expect(res.status).toBe(StatusCodes.OK);
    expect(res.body[0].role).toBe('user');
    expect(res.body[0].content).toBe('Quelle est la couleur du ciel en un mot ?');
    expect(res.body[1].role).toBe('assistant');
    expect(typeof res.body[1].content).toBe('string');
  });

  
  it('POST /conversations/:conversationId/messages:complete (stream)', async () => {  
    const res = await request(server.app)
      .post(`/conversations/${conversationId}/messages:complete`)
      .send({ 
        messages: [{ role: 'user', content: 'Quelle est la couleur du ciel en un mot ?'}],
        stream: true 
      })
      .set('Content-Type', 'application/json');
      
      expect(res.status).toBe(StatusCodes.OK);
      expect(res.headers['content-type']).toBe('text/event-stream');
    const matches = res.text.matchAll(/data:(.+)\n\n/g);
    for (const match of matches) {
      if (!match[1].includes('[DONE]')) {
        const json = JSON.parse(match[1]);
        expect(json.choices[0].delta.role).toBe('assistant');
      }
    }
  });


  afterAll(async () => {
    await request(server.app).delete(`/users/${username}`);
    // DB connection closed globally by Jest setup
  });
});


