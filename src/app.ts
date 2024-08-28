import fastify from 'fastify';
import path from 'path';
import { readingRoutes } from './http/controllers/reading/route';

export const app = fastify();

const directoryPath = path.resolve(__dirname, '../tmp');

app.register(readingRoutes);

app.register(require('@fastify/static'), {
  root: directoryPath,
  prefix: '/image/',
});
