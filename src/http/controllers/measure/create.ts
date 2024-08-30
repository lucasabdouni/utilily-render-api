import { makeCreateMeasureUseCase } from '@/use-cases/factories/make-create-measure-use-case';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const uploadBodySchema = z.object({
    image: z.string().refine(
      (data) => {
        return /^data:image\/[a-zA-Z]+;base64,/.test(data);
      },
      {
        message: 'Invalid Base64 string',
      },
    ),
    customer_code: z.string({ message: 'Invalid customer code' }),
    measure_datetime: z.coerce.date({ message: 'Invalid datetime' }),
    measure_type: z.enum(['WATER', 'GAS'], {
      message: 'Tipo de medição não permitida',
    }),
  });

  const data = uploadBodySchema.parse(request.body);

  const createMeasureUseCase = makeCreateMeasureUseCase();

  const measure = await createMeasureUseCase.execute(data);

  return reply.status(200).send(measure);
}
