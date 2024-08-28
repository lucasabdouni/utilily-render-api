import { FastifyInstance } from 'fastify';
import { upload } from './upload';

export async function readingRoutes(app: FastifyInstance) {
  app.post('/upload', upload);
}
