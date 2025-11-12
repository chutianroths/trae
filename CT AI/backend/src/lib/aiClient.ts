import { GoogleGenerativeAI, type GenerativeModel } from "@google/generative-ai";

import { env } from "@/config/env";

let model: GenerativeModel | null = null;

export function getGeminiModel(): GenerativeModel {
  if (!env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured");
  }
  if (!model) {
    const client = new GoogleGenerativeAI(env.GEMINI_API_KEY);
    model = client.getGenerativeModel({
      model: "models/gemini-2.5-flash-image",
    });
  }
  return model;
}

