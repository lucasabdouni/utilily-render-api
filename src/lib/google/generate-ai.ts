import { env } from '@/env';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { GoogleAIFileManager } from '@google/generative-ai/server';

const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);

export const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
export const fileManager = new GoogleAIFileManager(env.GEMINI_API_KEY);
