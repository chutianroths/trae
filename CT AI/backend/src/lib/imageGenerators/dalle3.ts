import { ImageGenerator, type ImageGenerationOptions, type ImageGenerationResult } from "./base";

/**
 * DALL-E 3 image generation client.
 * 
 * Implements OpenAI's DALL-E 3 API for image generation.
 * Documentation: https://platform.openai.com/docs/guides/images
 */
export class Dalle3Generator extends ImageGenerator {
  private readonly apiBaseUrl = "https://api.openai.com/v1/images/generations";

  constructor(apiKey: string) {
    super(apiKey, "dall-e-3");
  }

  /**
   * Generates images using DALL-E 3 API.
   * 
   * @param options - Image generation options
   * @returns Promise resolving to image generation result with base64 data URLs
   */
  async generate(options: ImageGenerationOptions): Promise<ImageGenerationResult> {
    this.validateApiKey();

    // DALL-E 3 only supports n=1
    const n = options.n ?? 1;
    if (n !== 1) {
      console.warn("DALL-E 3 only supports n=1. Ignoring n parameter.");
    }

    // DALL-E 3 supports specific sizes
    const size = this.validateSize(options.size ?? "1024x1024");
    
    // DALL-E 3 supports quality setting
    const quality = options.quality === "hd" ? "hd" : "standard";

    // DALL-E 3 supports style setting
    const style = options.style === "vivid" ? "vivid" : "natural";

    try {
      const response = await fetch(this.apiBaseUrl, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "dall-e-3",
          prompt: options.prompt,
          n: 1, // DALL-E 3 only supports n=1
          size,
          quality,
          style,
          response_format: "b64_json", // Request base64 response
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          `DALL-E 3 API error: ${errorData.error?.message || response.statusText} (${response.status})`
        );
      }

      const data = await response.json();
      
      // Convert base64 images to data URLs
      const images = data.data.map((item: { b64_json: string }) => {
        return `data:image/png;base64,${item.b64_json}`;
      });

      return {
        images,
        model: "dall-e-3",
        metadata: {
          prompt: options.prompt,
          size,
          quality,
          style,
        },
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to generate image with DALL-E 3: ${error.message}`);
      }
      throw new Error("Failed to generate image with DALL-E 3: Unknown error");
    }
  }

  /**
   * Validates and normalizes image size for DALL-E 3.
   * DALL-E 3 supports: "1024x1024", "1792x1024", "1024x1792"
   */
  private validateSize(size: string): string {
    const validSizes = ["1024x1024", "1792x1024", "1024x1792"];
    if (validSizes.includes(size)) {
      return size;
    }
    console.warn(`Invalid size "${size}" for DALL-E 3. Using default "1024x1024".`);
    return "1024x1024";
  }
}

