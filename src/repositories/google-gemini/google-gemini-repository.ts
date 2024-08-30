import { fileManager, model } from '@/lib/google/generate-ai';
import { GenerateMeasureRepository } from '../generate-measure-repository';

export class GoogleGeminiRepository implements GenerateMeasureRepository {
  async uploadFile(
    filePath: string,
    options: { mimeType: string; displayName: string },
  ): Promise<any> {
    return await fileManager.uploadFile(filePath, options);
  }

  async generateContent(ImgBase64: string, measure_type: string): Promise<any> {
    const promptConfig = [
      {
        text: `extract the measurement from ${measure_type} from the meter in the image`,
      },
      {
        inlineData: {
          mimeType: 'image/png',
          data: ImgBase64,
        },
      },
    ];

    return await model.generateContent({
      contents: [{ role: 'user', parts: promptConfig }],
    });
  }
}
