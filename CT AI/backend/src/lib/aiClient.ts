import { GoogleGenerativeAI, type GenerativeModel } from "@google/generative-ai";

import { env } from "@/config/env";

let model: GenerativeModel | null = null;

export function getGeminiModel(): GenerativeModel {
  if (!env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured");
  }
  if (!model) {
    const client = new GoogleGenerativeAI(env.GEMINI_API_KEY);
    // 使用标准的 Gemini 模型名称
    // 注意：Gemini 主要用于文本生成和图像理解，不是图像生成
    // 如果确实需要图像生成，可能需要使用 Imagen API 或其他服务
    model = client.getGenerativeModel({
      model: "gemini-1.5-flash", // 使用标准模型名称
    });
  }
  return model;
}

