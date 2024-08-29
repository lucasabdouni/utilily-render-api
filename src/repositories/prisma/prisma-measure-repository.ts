import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { MeasureRepository } from '../measure-repository';

export class PrismaMeasureRepository implements MeasureRepository {
  async findMeasureByCustomerInMonth(
    customer_code: string,
    startOfMonth: Date,
    endOfMonth: Date,
  ) {
    const measure = await prisma.measure.findFirst({
      where: {
        customer_code,
        measure_datetime: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
    });

    return measure;
  }

  async findMeasuresByMeasureUUID(measure_uuid: string) {
    const measure = await prisma.measure.findFirst({
      where: {
        measure_uuid,
      },
    });

    return measure;
  }

  async update(measure_uuid: string, data: Prisma.MeasureUpdateInput) {
    const measure = await prisma.measure.update({
      where: {
        measure_uuid,
      },
      data,
    });

    return measure;
  }

  async create(data: Prisma.MeasureCreateInput) {
    const measure = await prisma.measure.create({
      data,
    });

    return measure;
  }
}
