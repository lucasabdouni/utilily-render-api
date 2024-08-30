import { FastifyInstance } from 'fastify';
import { ZodError } from 'zod';
import { ClientError } from './errors/client-error';

type FastifyErrorHandler = FastifyInstance['errorHandler'];

export const errorHandler: FastifyErrorHandler = (error, request, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      error_code: 'INVALID_DATA',
      error_description: error.flatten().fieldErrors,
    });
  }

  if (error instanceof ClientError) {
    return reply.status(Number(error.statusCode)).send({
      error_code: error.code,
      error_description: error.message,
    });
  }

  if (error.name === 'GoogleGenerativeAIFetchError') {
    return reply.status(500).send({
      error_code: 'GEMINI_ERROR',
      error_description:
        'Erro durante a leitura da image, tente novamente mais tarde.',
    });
  }
  return reply.status(500).send({ message: 'Internal server error' });
};
