import { Customer, Prisma } from '@prisma/client';

export interface MensuaresByCustomer {
  customer_code: string;
  measures: {
    measure_uuid: string;
    measure_datetime: Date;
    measure_type: string;
    has_confirmed: boolean;
    image_url: string;
  }[];
}

export interface CustomerRepository {
  findCustomerByCode(customer_code: string): Promise<Customer | null>;
  findMeasuresByCustomer(
    customer_code: string,
    measure_type?: string,
  ): Promise<MensuaresByCustomer | null>;
  create(data: Prisma.CustomerCreateInput): Promise<Customer>;
}
