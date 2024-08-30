import { ClientError } from '@/errors/client-error';
import { InMemoryCustomerRepository } from '@/repositories/in-memory/in-memory-customer';
import { InMemoryGoogleGeminiRepository } from '@/repositories/in-memory/in-memory-google-gemini';
import { InMemoryMeasureRepository } from '@/repositories/in-memory/in-memory-measure';
import { beforeEach, describe, expect, it } from 'vitest';
import { CreateMeasureUseCase } from './create-measure';

let measureRepository: InMemoryMeasureRepository;
let customerRepository: InMemoryCustomerRepository;
let googleRepository: InMemoryGoogleGeminiRepository;
let sut: CreateMeasureUseCase;

describe('Create Measure Use Case', () => {
  beforeEach(async () => {
    measureRepository = new InMemoryMeasureRepository();
    customerRepository = new InMemoryCustomerRepository();
    googleRepository = new InMemoryGoogleGeminiRepository();
    sut = new CreateMeasureUseCase(
      customerRepository,
      measureRepository,
      googleRepository,
    );
  });

  it('should be able to create a customer if it does not exist', async () => {
    const { measure } = await sut.execute({
      customer_code: '121211',
      image: 'asdasda',
      measure_datetime: new Date('2024-08-30'),
      measure_type: 'WATER',
    });

    expect(measure.customer_code).toEqual(expect.any(String));
  });

  it('should be able to return an error if the client already has month reading', async () => {
    const customer = await customerRepository.create({
      customer_code: '123456',
    });

    await measureRepository.create({
      measure_datetime: new Date('2024-08-30'),
      measure_type: 'WATER',
      measure_value: 100,
      image_url: 'http://www.localhost:3333/johndoe',
      customer: {
        connect: { customer_code: customer.customer_code },
      },
    });

    expect(
      sut.execute({
        customer_code: customer.customer_code,
        image: 'asdasda',
        measure_datetime: new Date('2024-08-30'),
        measure_type: 'WATER',
      }),
    ).rejects.toBeInstanceOf(ClientError);
  });

  it('should be able to create an measure', async () => {
    const { measure } = await sut.execute({
      customer_code: '121211',
      image: 'asdasda',
      measure_datetime: new Date('2024-08-30'),
      measure_type: 'WATER',
    });

    expect(measure.measure_uuid).toEqual(measure.measure_uuid);
    expect(measure.measure_value).toEqual(0.01);
  });

  it('should be able to display an error if it does not receive the measurement', async () => {
    googleRepository.setSimulateErrorNull(true);

    expect(
      sut.execute({
        customer_code: '121211',
        image: 'asdasda',
        measure_datetime: new Date('2024-08-30'),
        measure_type: 'WATER',
      }),
    ).rejects.toBeInstanceOf(ClientError);
  });

  it('should be able to display an error if it does not find a measurement in the answer', async () => {
    googleRepository.setSimulateError(true);

    expect(
      sut.execute({
        customer_code: '121211',
        image: 'asdasda',
        measure_datetime: new Date('2024-08-30'),
        measure_type: 'WATER',
      }),
    ).rejects.toBeInstanceOf(ClientError);
  });
});
