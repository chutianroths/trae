/**
 * Image generation providers.
 * 
 * This module exports all available image generation providers
 * and a factory function to create the appropriate generator
 * based on the model name.
 */

export { ImageGenerator, type ImageGenerationOptions, type ImageGenerationResult } from "./base";
export { GeminiImageGenerator } from "./gemini";
export { Dalle3Generator } from "./dalle3";

import type { ImageGenerator } from "./base";
import { GeminiImageGenerator } from "./gemini";
import { Dalle3Generator } from "./dalle3";

export type GeneratorType = "gemini-2.5-flash-image-preview" | "dall-e-3" | "stable-diffusion" | "imagen" | "wenxin" | "tongyi";

/**
 * Factory function to create an image generator based on the model type.
 * 
 * @param type - Type of generator to create
 * @param apiKey - API key for the generator
 * @returns ImageGenerator instance
 * @throws Error if the generator type is not supported
 */
export function createImageGenerator(
  type: GeneratorType,
  apiKey: string
): ImageGenerator {
  switch (type) {
    case "gemini-2.5-flash-image-preview":
      return new GeminiImageGenerator(apiKey);
    case "dall-e-3":
      return new Dalle3Generator(apiKey);
    // Future generators can be added here:
    // case "stable-diffusion":
    //   return new StableDiffusionGenerator(apiKey);
    // case "imagen":
    //   return new ImagenGenerator(apiKey);
    // case "wenxin":
    //   return new WenxinGenerator(apiKey);
    // case "tongyi":
    //   return new TongyiGenerator(apiKey);
    default:
      throw new Error(`Unsupported generator type: ${type}`);
  }
}

/**
 * Determines the generator type from a model name string.
 * 
 * @param modelName - Model name (e.g., "Gemini 2.5 Flash Image", "DALL·E 3")
 * @returns GeneratorType or null if not recognized
 */
export function getGeneratorType(modelName: string): GeneratorType | null {
  const normalized = modelName.toLowerCase().replace(/[·\s-]/g, "");
  
  // Check for Gemini 2.5 Flash Image Preview
  if (
    normalized.includes("gemini") &&
    (normalized.includes("flashimage") ||
      normalized.includes("imagepreview") ||
      normalized.includes("2.5flash") ||
      normalized.includes("2.5"))
  ) {
    return "gemini-2.5-flash-image-preview";
  }
  
  // Check for DALL-E 3
  if (normalized.includes("dalle3") || normalized.includes("dalle") || normalized === "dall-e-3") {
    return "dall-e-3";
  }
  
  // Future models can be added here:
  // if (normalized.includes("stablediffusion") || normalized.includes("sdxl")) {
  //   return "stable-diffusion";
  // }
  
  return null;
}

