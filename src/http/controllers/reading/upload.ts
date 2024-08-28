import { fileManager, model } from '@/lib/google/generate-ai';
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

    const uploadResponse = await fileManager.uploadFile(filePath, {
      mimeType: 'image/png',
      displayName: `${fileName}`,
    });

    const fileUri = uploadResponse.file.uri;

    const result = await model.generateContent([
      {
        fileData: {
          mimeType: 'image/png',
          fileUri,
        },
      },
      {
        text: `
      extract the measurement from ${measure_type} from the meter in the image`,
      },
    ]);

    const extractMeasurementText = (text: string): string | null => {
      const regex = /\d+(\.\d+)?\s*[^\n]*/;
      const match = text.match(regex);
      return match ? match[0].trim() : null;
    };

    const responseText =
      result.response?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
    const measure_uuid = 'generated-guid';

    const measure_value = extractMeasurementText(responseText);

    reply.send({
      tempLink,
      measure_value,
      measure_uuid,
    });
  } catch (err) {
    throw err;
  }

  return reply.status(201).send();
}
