export interface GenerateMeasureRepository {
  generateContent(fileUri: string, measure_type: string): Promise<any>;
}
