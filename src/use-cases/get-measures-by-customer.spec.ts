import { ClientError } from '@/errors/client-error';
import { InMemoryCustomerRepository } from '@/repositories/in-memory/in-memory-customer';
import { beforeEach, describe, expect, it } from 'vitest';
import { GetMeasuresByCustomerUseCase } from './get-measures-by-customer';

let customerRepository: InMemoryCustomerRepository;
let sut: GetMeasuresByCustomerUseCase;

describe('Get Measures by Customer Use Case', () => {
  beforeEach(async () => {
    customerRepository = new InMemoryCustomerRepository();
    sut = new GetMeasuresByCustomerUseCase(customerRepository);

    await customerRepository.create({
      customer_code: '123456',
    });
  });

  it('should be able to return an error if the customer does not exist', async () => {
    expect(
      sut.execute({
        customer_code: '6asd1e',
      }),
    ).rejects.toBeInstanceOf(ClientError);
  });

  it('should be able to return an error if the measurement does not exist', async () => {
    expect(
      sut.execute({
        customer_code: '123456',
        measure_type: 'GAS',
      }),
    ).rejects.toBeInstanceOf(ClientError);
  });

  it('should be able to return a customer', async () => {
    const { customer } = await sut.execute({
      customer_code: '123456',
      measure_type: 'WATER',
    });

    expect(customer.customer_code).toEqual(expect.any(String));
  });
});
