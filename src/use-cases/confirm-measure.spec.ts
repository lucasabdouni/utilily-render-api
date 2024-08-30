import { ClientError } from '@/errors/client-error';
import { InMemoryMeasureRepository } from '@/repositories/in-memory/in-memory-measure';
import { beforeEach, describe, expect, it } from 'vitest';
import { ConfirmMeasuresUseCase } from './confirm-measure';

let measureRepository: InMemoryMeasureRepository;
let sut: ConfirmMeasuresUseCase;

describe('Confirm Measure Use Case', () => {
  beforeEach(async () => {
    measureRepository = new InMemoryMeasureRepository();
    sut = new ConfirmMeasuresUseCase(measureRepository);
  });

  it('should be able to return an error if the reading does not exist', async () => {
    await measureRepository.create({
      measure_datetime: new Date(),
      measure_type: 'WATER',
      measure_value: 100,
      image_url: 'http://www.localhost:3333/johndoe',
      customer: {},
    });

    expect(
      sut.execute({
        confirmed_value: 100,
        measure_uuid: 'non-existing-measure-uuid',
      }),
    ).rejects.toBeInstanceOf(ClientError);
  });

  it('must be able to confirm a reading', async () => {
    const createMasure = await measureRepository.create({
      measure_datetime: new Date(),
      measure_type: 'WATER',
      measure_value: 100,
      image_url: 'http://www.localhost:3333/johndoe',
      customer: {},
    });

    const { measure } = await sut.execute({
      measure_uuid: createMasure.measure_uuid,
      confirmed_value: 50,
    });

    expect(measure.has_confirmed).toBeTruthy();
    expect(measure.measure_value).toEqual(50);
  });

  it('should be able to return an error if the measurement does not exist', async () => {
    const createMasure = await measureRepository.create({
      measure_datetime: new Date(),
      measure_type: 'WATER',
      measure_value: 100,
      image_url: 'http://www.localhost:3333/johndoe',
      customer: {},
    });

    await sut.execute({
      measure_uuid: createMasure.measure_uuid,
      confirmed_value: 50,
    });

    expect(
      sut.execute({
        confirmed_value: 100,
        measure_uuid: createMasure.measure_uuid,
      }),
    ).rejects.toBeInstanceOf(ClientError);
  });
});
