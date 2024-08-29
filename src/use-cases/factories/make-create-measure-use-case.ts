import { GoogleGeminiRepository } from '@/repositories/google-gemini/google-gemini-repository';
import { PrismaCustomerRepository } from '@/repositories/prisma/prisma-customer-repository';
import { PrismaMeasureRepository } from '@/repositories/prisma/prisma-measure-repository';
import { CreateMeasureUseCase } from '../create-measure';

export function makeCreateMeasureUseCase() {
  const customerRepository = new PrismaCustomerRepository();
  const measureRepository = new PrismaMeasureRepository();
  const generateMeasureRepository = new GoogleGeminiRepository();

  const useCase = new CreateMeasureUseCase(
    customerRepository,
    measureRepository,
    generateMeasureRepository,
  );

  return useCase;
}
