import { Measure, Prisma } from '@prisma/client';

export interface MeasureRepository {
  findMeasureByCustomerInMonth(
    customer_code: string,
    startOfMonth: Date,
    endOfMonth: Date,
  ): Promise<Measure | null>;
  findMeasuresByMeasureUUID(measure_uuid: string): Promise<Measure | null>;
  create(data: Prisma.MeasureCreateInput): Promise<Measure>;
  update(
    measure_uuid: string,
    data: Prisma.MeasureUpdateInput,
  ): Promise<Measure>;
}
