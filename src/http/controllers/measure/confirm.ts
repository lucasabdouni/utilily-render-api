import { makeConfirmMeasureUseCase } from '@/use-cases/factories/make-confirm-measure-use-case';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

export async function confirm(request: FastifyRequest, reply: FastifyReply) {
  const uploadBodySchema = z.object({
    measure_uuid: z.string().uuid({ message: 'Invalid measure uuid' }),
    confirmed_value: z.number({ message: 'Invalid value' }),
  });

  const data = uploadBodySchema.parse(request.body);

  const confirmMeasureUseCase = makeConfirmMeasureUseCase();

  await confirmMeasureUseCase.execute(data);

  return reply.status(200).send({ sucess: true });
}
