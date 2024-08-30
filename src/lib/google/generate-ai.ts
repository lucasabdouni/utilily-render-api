import { env } from '@/env';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { GoogleAIFileManager } from '@google/generative-ai/server';

const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);

const generationConfig = {
  temperature: 0.4,
  topP: 1,
  topK: 32,
  maxOutputTokens: 4096,
};

export const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-pro',
  generationConfig,
});
export const fileManager = new GoogleAIFileManager(env.GEMINI_API_KEY);
