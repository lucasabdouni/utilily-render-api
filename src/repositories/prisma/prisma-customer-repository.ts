import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { CustomerRepository } from '../customer-repository';

export class PrismaCustomerRepository implements CustomerRepository {
  async findCustomerByCode(customer_code: string) {
    const customer = await prisma.customer.findUnique({
      where: {
        customer_code,
      },
    });

    return customer;
  }

  async findMeasuresByCustomer(customer_code: string, measure_type?: string) {
    const customer = await prisma.customer.findUnique({
      where: {
        customer_code,
      },
      select: {
        customer_code: true,
        measures: {
          select: {
            measure_uuid: true,
            measure_datetime: true,
            measure_type: true,
            has_confirmed: true,
            image_url: true,
          },
          where: measure_type ? { measure_type: measure_type } : {}, // Condição opcional
        },
      },
    });

    return customer;
  }

  async create(data: Prisma.CustomerCreateInput) {
    const customer = await prisma.customer.create({
      data,
    });

    return customer;
  }
}
