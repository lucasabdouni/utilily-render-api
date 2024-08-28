import { FastifyReply, FastifyRequest } from 'fastify';
import fs from 'fs';
import path from 'path';
import { z } from 'zod';

export async function upload(request: FastifyRequest, reply: FastifyReply) {
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
    measure_type: z.enum(['WATER', 'GAS']),
  });

  const { image, customer_code, measure_datetime, measure_type } =
    uploadBodySchema.parse(request.body);

  const convertImgBase64 = image.replace(/^data:image\/\w+;base64,/, '');
  const buffer = Buffer.from(convertImgBase64, 'base64');

  const timestamp = measure_datetime.getTime();
  const fileName = `${customer_code}-${timestamp}-${measure_type}.png`;

  const directoryPath = path.resolve(__dirname, '../../../../tmp');
  const filePath = path.join(directoryPath, fileName);

  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath, { recursive: true });
  }

  try {
    fs.writeFileSync(filePath, buffer);

    const tempLink = `http://localhost:3333/image/${fileName}`;

    reply.send({ link: tempLink });
  } catch (err) {
    throw err;
  }

  return reply.status(201).send();
}
