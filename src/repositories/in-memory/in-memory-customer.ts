import { Customer, Prisma } from '@prisma/client';
import { randomUUID } from 'crypto';
import {
  CustomerRepository,
  MensuaresByCustomer,
} from '../customer-repository';

export class InMemoryCustomerRepository implements CustomerRepository {
  private items: Customer[] = [];

  async findCustomerByCode(customer_code: string): Promise<Customer | null> {
    const customer = this.items.find(
      (item) => item.customer_code === customer_code,
    );
    return customer || null;
  }

  async create(data: Prisma.CustomerCreateInput): Promise<Customer> {
    const newCustomer: Customer = {
      customer_code: data.customer_code,
      created_at: new Date(),
    };

    this.items.push(newCustomer);
    return newCustomer;
  }

  async findMeasuresByCustomer(customer_code: string, measure_type?: string) {
    const checkCustomer = this.items.find(
      (item) => item.customer_code === customer_code,
    );

    if (checkCustomer) {
      let customer: MensuaresByCustomer = {
        customer_code,
        measures: [
          {
            measure_uuid: randomUUID(),
            measure_datetime: new Date(),
            measure_type: 'WATER',
            has_confirmed: false,
            image_url: 'http://localhost:3333/imagem/johndoe',
          },
        ],
      };

      if (measure_type) {
        customer.measures = customer.measures.filter(
          (item) => item.measure_type === measure_type,
        );
      }

      return customer;
    }

    return null;
  }
}
