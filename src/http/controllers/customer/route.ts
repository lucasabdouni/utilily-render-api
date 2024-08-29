import { FastifyInstance } from 'fastify';
import { listMeasureByCostumer } from './list-measure-by-customer';

export async function customerRoutes(app: FastifyInstance) {
  app.get('/:customer_code/list', listMeasureByCostumer);
}
