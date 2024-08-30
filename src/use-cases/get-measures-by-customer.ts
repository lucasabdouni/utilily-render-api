import { ClientError } from '@/errors/client-error';
import {
  CustomerRepository,
  MensuaresByCustomer,
} from '@/repositories/customer-repository';

interface GetMeasuresByCustomerUseCaseRequest {
  customer_code: string;
  measure_type?: 'WATER' | 'GAS';
}

interface GetMeasuresByCustomerUseCaseResponse {
  customer: MensuaresByCustomer;
}
export class GetMeasuresByCustomerUseCase {
  constructor(private customersRepository: CustomerRepository) {}

  async execute({
    customer_code,
    measure_type,
  }: GetMeasuresByCustomerUseCaseRequest): Promise<GetMeasuresByCustomerUseCaseResponse> {
    const customer = await this.customersRepository.findMeasuresByCustomer(
      customer_code,
      measure_type,
    );

    if (!customer) {
      throw new ClientError(
        404,
        'CUSTOMER_NOT_FOUND',
        'Nenhum customer encontrado',
      );
    }

    console.log('aquiiii');
    console.log(customer);

    if (customer.measures.length === 0) {
      throw new ClientError(
        404,
        'MEASURES_NOT_FOUND',
        'Nenhuma leitura encontrada',
      );
    }

    return { customer };
  }
}
