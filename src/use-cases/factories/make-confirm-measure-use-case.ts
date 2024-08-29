import { PrismaMeasureRepository } from '@/repositories/prisma/prisma-measure-repository';
import { ConfirmMeasuresUseCase } from '../confirm-measure';

export function makeConfirmMeasureUseCase() {
  const measureRepository = new PrismaMeasureRepository();

  const useCase = new ConfirmMeasuresUseCase(measureRepository);

  return useCase;
}
