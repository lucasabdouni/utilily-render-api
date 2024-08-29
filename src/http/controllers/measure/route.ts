import { FastifyInstance } from 'fastify';
import { confirm } from './confirm';
import { create } from './create';

export async function readingRoutes(app: FastifyInstance) {
  app.post('/create', create);
  app.patch('/confirm', confirm);
}
