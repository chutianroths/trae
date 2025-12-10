/**
 * Base interface for all image generation providers.
 * 
 * This interface defines the contract that all image generation
 * implementations must follow, enabling easy switching between
 * different AI models (DALL-E, Stable Diffusion, etc.).
 */
export interface ImageGenerationOptions {
  /** Text prompt describing the desired image */
  prompt: string;
  /** Number of images to generate (default: 1) */
  n?: number;
  /** Image size (e.g., "1024x1024", "1792x1024") */
  size?: string;
  /** Quality setting (e.g., "standard", "hd") */
  quality?: string;
  /** Image style (e.g., "vivid", "natural") */
  style?: string;
}

export interface ImageGenerationResult {
  /** Array of generated image URLs or base64 data URLs */
  images: string[];
  /** Model used for generation */
  model: string;
  /** Generation metadata */
  metadata?: {
    prompt?: string;
    seed?: number;
    [key: string]: unknown;
  };
}

/**
 * Base class for image generation providers.
 * 
 * All image generation implementations should extend this class
 * and implement the generate method.
 */
export abstract class ImageGenerator {
  protected apiKey: string;
  protected modelName: string;

  constructor(apiKey: string, modelName: string) {
    if (!apiKey) {
      throw new Error(`API key is required for ${modelName}`);
    }
    this.apiKey = apiKey;
    this.modelName = modelName;
  }

  /**
   * Generates images based on the provided prompt and options.
   * 
   * @param options - Image generation options
   * @returns Promise resolving to image generation result
   * @throws Error if generation fails
   */
  abstract generate(options: ImageGenerationOptions): Promise<ImageGenerationResult>;

  /**
   * Returns the model name being used.
   */
  getModelName(): string {
    return this.modelName;
  }

  /**
   * Validates that the API key is properly configured.
   */
  protected validateApiKey(): void {
    if (!this.apiKey || this.apiKey.trim().length === 0) {
      throw new Error(`API key for ${this.modelName} is not configured`);
    }
  }
}

