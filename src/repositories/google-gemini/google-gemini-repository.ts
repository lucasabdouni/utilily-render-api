import { ClientError } from '@/errors/client-error';
import { fileManager, model } from '@/lib/google/generate-ai';
import { GenerateMeasureRepository } from '../generate-measure-repository';

export class GoogleGeminiRepository implements GenerateMeasureRepository {
  async uploadFile(
    filePath: string,
    options: { mimeType: string; displayName: string },
  ): Promise<any> {
    return await fileManager.uploadFile(filePath, options);
  }

  async generateContent(imgBase64: string, measureType: string): Promise<any> {
    try {
      const promptConfig = [
        {
          text: `Extract the measurement of ${measureType} from the meter in the image.`,
        },
        {
          inlineData: {
            mimeType: 'image/png',
            data: imgBase64,
          },
        },
      ];

      return await model.generateContent({
        contents: [{ role: 'user', parts: promptConfig }],
      });
    } catch (error) {
      throw new ClientError(
        500,
        'GEMINI_ERROR',
        'Erro durante a leitura da imagem, tente novamente mais tarde.',
      );
    }
  }
}
