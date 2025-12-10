import { GoogleGenerativeAI } from "@google/generative-ai";
import { ImageGenerator, type ImageGenerationOptions, type ImageGenerationResult } from "./base";

/**
 * Gemini 2.5 Flash Image Preview generator.
 * 
 * Implements Google's Gemini 2.5 Flash Image Preview API for image generation.
 * This model supports:
 * - Text-to-image generation
 * - Image editing
 * - Multi-image fusion
 * 
 * Documentation: https://ai.google.dev/models/gemini
 */
export class GeminiImageGenerator extends ImageGenerator {
  private client: GoogleGenerativeAI;
  private model: ReturnType<GoogleGenerativeAI["getGenerativeModel"]> | null = null;

  constructor(apiKey: string) {
    super(apiKey, "gemini-2.5-flash-image-preview");
    this.client = new GoogleGenerativeAI(apiKey);
  }

  /**
   * Gets or creates the Gemini model instance.
   */
  private getModel() {
    if (!this.model) {
      // Try gemini-2.5-flash-image first, fallback to gemini-2.5-flash-image-preview
      // Note: The actual model name may vary based on Google's API
      try {
        this.model = this.client.getGenerativeModel({
          model: "gemini-2.5-flash-image",
        });
      } catch {
        // Fallback to preview version
        this.model = this.client.getGenerativeModel({
          model: "gemini-2.5-flash-image-preview",
        });
      }
    }
    return this.model;
  }

  /**
   * Generates images using Gemini 2.5 Flash Image Preview API.
   * 
   * @param options - Image generation options
   * @returns Promise resolving to image generation result with base64 data URLs
   */
  async generate(options: ImageGenerationOptions): Promise<ImageGenerationResult> {
    this.validateApiKey();

    const model = this.getModel();

    try {
      // Gemini 2.5 Flash Image Preview generates images based on text prompts
      const result = await model.generateContent({
        contents: [
          {
            role: "user",
            parts: [{ text: options.prompt }],
          },
        ],
        generationConfig: {
          // Configure generation parameters if needed
          temperature: 0.9,
          topK: 40,
          topP: 0.95,
        },
      });

      // Extract image data from the response
      const candidates = result.response.candidates ?? [];
      const imageParts = candidates
        .flatMap((candidate) => candidate.content?.parts ?? [])
        .filter((part) => part.inlineData?.mimeType?.startsWith("image/"));

      if (imageParts.length === 0) {
        // If no images in response, check if there's text that might indicate an error
        const textResponse = result.response.text();
        throw new Error(
          `Gemini did not return image data. Response: ${textResponse.substring(0, 200)}`
        );
      }

      // Convert image parts to data URLs
      const images = imageParts.map((part) => {
        if (!part.inlineData?.data) {
          throw new Error("Image part missing data");
        }
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      });

      return {
        images,
        model: "gemini-2.5-flash-image-preview",
        metadata: {
          prompt: options.prompt,
          count: images.length,
        },
      };
    } catch (error) {
      if (error instanceof Error) {
        // Provide more helpful error messages for common issues
        const errorMessage = error.message;
        
        // Check for quota/rate limit errors
        if (errorMessage.includes("429") || errorMessage.includes("quota")) {
          throw new Error(
            `Gemini API quota exceeded. Please check your usage at https://ai.dev/usage?tab=rate-limit. ` +
            `The free tier has limited requests per day. You may need to wait for quota reset or upgrade your plan.`
          );
        }
        
        // Check for authentication errors
        if (errorMessage.includes("401") || errorMessage.includes("403")) {
          throw new Error(
            `Gemini API authentication failed. Please check your API key in the .env.local file.`
          );
        }
        
        throw new Error(`Failed to generate image with Gemini: ${errorMessage}`);
      }
      throw new Error("Failed to generate image with Gemini: Unknown error");
    }
  }
}

