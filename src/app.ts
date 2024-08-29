import fastify from 'fastify';
import path from 'path';
import { customerRoutes } from './http/controllers/customer/route';
import { readingRoutes } from './http/controllers/measure/route';

export const app = fastify();

const directoryPath = path.resolve(__dirname, '../tmp');

app.register(readingRoutes);
app.register(customerRoutes);

app.register(require('@fastify/static'), {
  root: directoryPath,
  prefix: '/image/',
});
