import { extractMeasurementText } from '@/helpers/extract-measure-number';
import { CustomerRepository } from '@/repositories/customer-repository';
import { GenerateMeasureRepository } from '@/repositories/generate-measure-repository';
import { Measure } from '@prisma/client';
import dayjs from 'dayjs';
import fs from 'fs';
import path from 'path';
import { MeasureRepository } from '../repositories/measure-repository';

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
      if (existingMeasure) throw new Error('Leitura do mês já realizada.');
    } else {
      customer = await this.customerRepository.create({ customer_code });
    }

    const fileName = `${customer_code}-${measure_datetime.getTime()}-${measure_type}.png`;
    const convertImgBase64 = image.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(convertImgBase64, 'base64');

    const directoryPath = path.resolve(__dirname, '../../tmp');
    const filePath = path.join(directoryPath, fileName);

    if (!fs.existsSync(directoryPath)) {
      fs.mkdirSync(directoryPath, { recursive: true });
    }

    fs.writeFileSync(filePath, buffer);

    const uploadResponse = await this.generateMeasureRepository.uploadFile(
      filePath,
      {
        mimeType: 'image/png',
        displayName: filePath.split('/').pop() || '',
      },
    );

    const mimeType = uploadResponse.file.mimeType;
    const fileUri = uploadResponse.file.uri;

    const result = await this.generateMeasureRepository.generateContent(
      fileUri,
      mimeType,
      measure_type,
    );

    if (result) throw new Error('Erro ao realizar a leitura.');

    const responseText =
      result.response?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';

    const measure_value = extractMeasurementText(responseText);

    if (measure_value === null)
      throw new Error('Não foi encontrado um valor na medição.');

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
