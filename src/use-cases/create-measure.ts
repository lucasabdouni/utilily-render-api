import { ClientError } from '@/errors/client-error';
import { CustomerRepository } from '@/repositories/customer-repository';
import { GenerateMeasureRepository } from '@/repositories/generate-measure-repository';
import { Measure } from '@prisma/client';
import { randomUUID } from 'crypto';
import dayjs from 'dayjs';
import fs from 'fs';
import path from 'path';
import { MeasureRepository } from '../repositories/measure-repository';

import { extractMeasurementText } from '@/helpers/extract-measure-number';

interface CreateMeasureUseCaseRequest {
  image: string;
  customer_code: string;
  measure_datetime: Date;
  measure_type: 'WATER' | 'GAS';
}

interface CreateMeasureUseCaseResponse {
  measure: Measure;
}

export class CreateMeasureUseCase {
  constructor(
    private customerRepository: CustomerRepository,
    private measureRepository: MeasureRepository,
    private generateMeasureRepository: GenerateMeasureRepository,
  ) {}

  async execute({
    image,
    customer_code,
    measure_datetime,
    measure_type,
  }: CreateMeasureUseCaseRequest): Promise<CreateMeasureUseCaseResponse> {
    let customer = await this.customerRepository.findCustomerByCode(
      customer_code,
    );

    const startOfMonth = dayjs(measure_datetime).startOf('month').toDate();
    const endOfMonth = dayjs(measure_datetime).endOf('month').toDate();

    if (customer) {
      const existingMeasure =
        await this.measureRepository.findMeasureByCustomerInMonth(
          customer_code,
          startOfMonth,
          endOfMonth,
        );
      if (existingMeasure)
        throw new ClientError(
          409,
          'DOUBLE_REPORT',
          'Leitura do mês já realizada.',
        );
    } else {
      customer = await this.customerRepository.create({ customer_code });
    }

    const fileName = `${customer_code}-${randomUUID()}-${measure_type}.png`;
    const convertImgBase64 = image.replace(/^data:image\/\w+;base64,/, '');

    const result = await this.generateMeasureRepository.generateContent(
      convertImgBase64,
      measure_type,
    );

    const response = await result.response;

    const responseText = response.text();

    if (!responseText)
      throw new ClientError(
        500,
        'VISION_ERROR',
        'Não foi possível processar a imagem. Por favor, tente novamente.',
      );

    const measure_value = extractMeasurementText(responseText);

    if (measure_value === null)
      throw new ClientError(
        422,
        'UNPROCESSABLE_ENTITY',
        'Não foi possível processar ou encontrar medição na imagem enviada.',
      );

    const buffer = Buffer.from(convertImgBase64, 'base64');

    const directoryPath = path.resolve(__dirname, '../../tmp');
    const filePath = path.join(directoryPath, fileName);

    if (!fs.existsSync(directoryPath)) {
      fs.mkdirSync(directoryPath, { recursive: true });
    }

    fs.writeFileSync(filePath, buffer);

    const image_url = `http://localhost:3333/image/${fileName}`;

    const measure = await this.measureRepository.create({
      image_url,
      measure_datetime,
      measure_type,
      measure_value,
      customer: {
        connect: { customer_code },
      },
    });

    return { measure };
  }
}
