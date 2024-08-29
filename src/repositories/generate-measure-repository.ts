export interface GenerateMeasureRepository {
  uploadFile(
    filePath: string,
    options: { mimeType: string; displayName: string },
  ): Promise<any>;
  generateContent(
    fileUri: string,
    mimeType: string,
    measureType: string,
  ): Promise<any>;
}
