import { makeGetMeasuresByCustomerUseCase } from '@/use-cases/factories/make-get-measures-by-customer-use-case';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

export async function listMeasureByCostumer(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const MeasureTypeEnum = z.enum(['WATER', 'GAS']);
  const toUpperCase = (value: string) => value.toUpperCase();

  const createCheckInParamsSchema = z.object({
    customer_code: z.string(),
  });

  const createCheckInQueryParamsSchema = z.object({
    measure_type: z
      .string()
      .transform(toUpperCase)
      .refine((value) => MeasureTypeEnum.options.includes(value as any), {
        message: 'Tipo de medição não permitida',
      })
      .optional(),
  });

  const { customer_code } = createCheckInParamsSchema.parse(request.params);
  const { measure_type } = createCheckInQueryParamsSchema.parse(request.query);

  const getMeasuresByCustomerUseCase = makeGetMeasuresByCustomerUseCase();

  type MeasureType = 'WATER' | 'GAS';

  const data: { measure_type?: MeasureType; customer_code: string } = {
    customer_code,
    ...(measure_type && (measure_type as MeasureType)
      ? { measure_type: measure_type as MeasureType }
      : {}),
  };

  const response = await getMeasuresByCustomerUseCase.execute(data);

  return reply.status(200).send(response);
}
