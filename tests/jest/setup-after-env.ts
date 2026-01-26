import { beforeAll, afterAll } from '@jest/globals';
import environment from '../../src/environment.js';
import database from '../../src/database/client.js';

beforeAll(async () => {
  process.env.NODE_ENV = 'test';
  if (!environment.isLoaded) {
    environment.init();
  }
  await database.init();
});

afterAll(async () => {
  await database.close();
});
