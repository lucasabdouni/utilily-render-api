import { Measure, Prisma } from '@prisma/client';
import dayjs from 'dayjs';
import { randomUUID } from 'node:crypto';
import { MeasureRepository } from '../measure-repository';

export class InMemoryMeasureRepository implements MeasureRepository {
  public items: Measure[] = [];

  async findMeasureByCustomerInMonth(
    customer_code: string,
    startOfMonth: Date,
    endOfMonth: Date,
  ) {
    const measure = this.items.find((item) => {
      const measureDate = dayjs(item.measure_datetime);
      return (
        item.customer_code === customer_code &&
        measureDate.isAfter(startOfMonth) &&
        measureDate.isBefore(endOfMonth)
      );
    });

    return measure || null;
  }

  async findMeasuresByMeasureUUID(measure_uuid: string) {
    const measure = this.items.find(
      (item) => item.measure_uuid === measure_uuid,
    );
    return measure || null;
  }

  async update(measure_uuid: string, data: Prisma.MeasureUpdateInput) {
    if (this.items.length >= 0) {
      const measureIndex = this.items.findIndex(
        (item) => item.measure_uuid === measure_uuid,
      );

      const updatedMeasure: Measure = {
        measure_uuid: measure_uuid,
        measure_datetime: this.items[measureIndex].measure_datetime,
        created_at: this.items[measureIndex].created_at,
        updatedAt: new Date(),
        measure_type: this.items[measureIndex].measure_type,
        measure_value: Number(data.measure_value),
        has_confirmed: data.has_confirmed === true,
        image_url: this.items[measureIndex].image_url,
        customer_code: this.items[measureIndex].customer_code,
      };

      this.items[measureIndex] = updatedMeasure;

      return updatedMeasure;
    }

    const newMeasure: Measure = {
      measure_uuid: measure_uuid,
      measure_datetime: new Date(),
      created_at: new Date(),
      updatedAt: new Date(),
      measure_type: 'GAS',
      measure_value: 1,
      has_confirmed: true,
      image_url: 'http://localhost:3333/imagem/johndoe',
      customer_code: '123456',
    };

    return newMeasure;
  }

  async create(data: Prisma.MeasureCreateInput): Promise<Measure> {
    const customer_code = data.customer.connect?.customer_code || '123456';

    const newMeasure: Measure = {
      measure_uuid: randomUUID(),
      measure_datetime: new Date(data.measure_datetime),
      created_at: new Date(),
      updatedAt: new Date(),
      measure_type: data.measure_type,
      measure_value: data.measure_value,
      has_confirmed: false,
      image_url: data.image_url,
      customer_code: customer_code,
    };

    this.items.push(newMeasure);

    return newMeasure;
  }
}
