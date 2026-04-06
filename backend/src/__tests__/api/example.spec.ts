import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import supertest from 'supertest';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import { buildApiRoutes } from '../../../db/router';

describe('Auth API', () => {
  let app: ReturnType<typeof Fastify>;

  beforeAll(async () => {
    app = Fastify();
    
    await app.register(jwt, { secret: 'test-secret' });
    await app.register(cors, { origin: ['http://localhost:9204'] });
    app.register(buildApiRoutes, { prefix: '/api' });
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should register a new user and return a token', async () => {
    const timestamp = Date.now();
    
    const res = await supertest(app.server)
      .post('/api/users/register')
      .send({ username: `testuser_${timestamp}`, password: 'password123' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(typeof res.body.token).toBe('string');
  });
});
