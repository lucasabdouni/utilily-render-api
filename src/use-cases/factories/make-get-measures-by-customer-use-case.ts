import { PrismaCustomerRepository } from '@/repositories/prisma/prisma-customer-repository';
import { GetMeasuresByCustomerUseCase } from '../get-measures-by-customer';

export function makeGetMeasuresByCustomerUseCase() {
  const customerRepository = new PrismaCustomerRepository();

  const useCase = new GetMeasuresByCustomerUseCase(customerRepository);

  return useCase;
}
