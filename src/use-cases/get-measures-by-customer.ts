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
      throw new Error('Customer not found');
    }

    if (customer.measures.length < 0) {
      throw new Error('Nenhuma leitura encontrada');
    }

    return { customer };
  }
}
