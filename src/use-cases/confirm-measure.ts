import { ClientError } from '@/errors/client-error';
import { MeasureRepository } from '@/repositories/measure-repository';
import { Measure, Prisma } from '@prisma/client';

interface ConfirmMeasuresUseCaseRequest {
  measure_uuid: string;
  confirmed_value: number;
}

interface ConfirmMeasuresUseCaseResponse {
  measure: Measure;
}
export class ConfirmMeasuresUseCase {
  constructor(private measureRepository: MeasureRepository) {}

  async execute({
    confirmed_value,
    measure_uuid,
  }: ConfirmMeasuresUseCaseRequest): Promise<ConfirmMeasuresUseCaseResponse> {
    const checkMeasure = await this.measureRepository.findMeasuresByMeasureUUID(
      measure_uuid,
    );

    if (!checkMeasure)
      throw new ClientError(
        404,
        'MEASURE_NOT_FOUND',
        'Leitura não encontrada.',
      );

    if (checkMeasure.has_confirmed)
      throw new ClientError(
        422,
        'CONFIRMATION_DUPLICATE',
        'Leitura do mês já realizada.',
      );

    const data: Prisma.MeasureUpdateInput = {
      measure_value: confirmed_value,
      has_confirmed: true,
    };

    const measure = await this.measureRepository.update(measure_uuid, data);

    return { measure };
  }
}
