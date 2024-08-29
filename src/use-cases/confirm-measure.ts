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

    if (!checkMeasure) throw new Error('Leitura não encontrada.');

    if (checkMeasure.has_confirmed)
      throw new Error('Leitura do mês já realizada.');

    const data: Prisma.MeasureUpdateInput = {
      measure_value: confirmed_value,
      has_confirmed: true,
    };

    const measure = await this.measureRepository.update(measure_uuid, data);

    return { measure };
  }
}
