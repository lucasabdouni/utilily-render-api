export function extractMeasurementText(text: string): number | null {
  const regex = /(\d+(\.\d+)?)/;
  const match = text.match(regex);
  return match ? parseFloat(match[0].trim()) : null;
}
