import { fileManager, model } from '@/lib/google/generate-ai';
import { GenerateMeasureRepository } from '../generate-measure-repository';

export class GoogleGeminiRepository implements GenerateMeasureRepository {
  async uploadFile(
    filePath: string,
    options: { mimeType: string; displayName: string },
  ): Promise<any> {
    return await fileManager.uploadFile(filePath, options);
  }

  async generateContent(
    fileUri: string,
    mimeType: string,
    measureType: string,
  ): Promise<any> {
    return await model.generateContent([
      {
        fileData: {
          mimeType,
          fileUri,
        },
      },
      {
        text: `extract the measurement from ${measureType} from the meter in the image`,
      },
    ]);
  }
}
