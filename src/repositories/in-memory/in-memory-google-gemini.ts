import { GenerateMeasureRepository } from '../generate-measure-repository';

export class InMemoryGoogleGeminiRepository
  implements GenerateMeasureRepository
{
  private simulateError: boolean = false;
  private simulateErrorNull: boolean = false;

  setSimulateError(value: boolean) {
    this.simulateError = value;
  }

  setSimulateErrorNull(value: boolean) {
    this.simulateErrorNull = value;
  }

  async generateContent(imgBase64: string, measureType: string): Promise<any> {
    if (this.simulateError) {
      return {
        response: {
          text: () => 'Não encontrado valor',
        },
      };
    }

    if (this.simulateErrorNull) {
      return {
        response: {
          text: () => null,
        },
      };
    }

    const measurement = 'the value found was 0.01 m3';

    return {
      response: {
        text: () => measurement,
      },
    };
  }
}
