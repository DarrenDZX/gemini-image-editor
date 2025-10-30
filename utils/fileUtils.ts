
import type { Part } from '@google/genai';

// FIX: Simplified fileToGenerativePart to directly extract base64 data from the data URL.
// The previous implementation was inefficiently decoding and re-encoding the data.
export async function fileToGenerativePart(dataUrl: string, mimeType: string): Promise<Part> {
  // dataUrl is in the format "data:<mime-type>;base64,<base64-data>"
  // We just need to extract the base64 part.
  const parts = dataUrl.split(',');
  if (parts.length < 2 || !parts[1]) {
    throw new Error('Invalid data URL format.');
  }
  const base64Data = parts[1];
  
  return {
    inlineData: {
      data: base64Data,
      mimeType,
    },
  };
}
