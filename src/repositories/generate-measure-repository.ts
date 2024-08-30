export interface GenerateMeasureRepository {
  uploadFile(
    filePath: string,
    options: { mimeType: string; displayName: string },
  ): Promise<any>;
  generateContent(fileUri: string, measure_type: string): Promise<any>;
}
