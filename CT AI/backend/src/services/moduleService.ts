import { z } from "zod";

import { env } from "@/config/env";
import {
  createImageGenerator,
  getGeneratorType,
  type ImageGenerationOptions,
} from "@/lib/imageGenerators";
import {
  createModule,
  findModuleByModuleId,
  listModules,
  type ListModulesOptions,
} from "@/repositories/moduleRepository";
import type { ModuleDocument } from "@/types/module";

const listQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  pageSize: z.coerce.number().int().positive().max(100).optional(),
  category: z.enum(["repair", "enhancement", "style", "creative"]).optional(),
  enabled: z.coerce.boolean().optional(),
  visibility: z.enum(["admin", "editor", "user"]).optional(),
  search: z.string().min(1).optional(),
  tags: z
    .string()
    .transform((value) => value.split(",").map((tag) => tag.trim()).filter(Boolean))
    .optional(),
  sort: z.enum(["recent", "popular", "rating"]).optional(),
});

const seedModuleSchema = z.object({
  moduleId: z.string().min(1),
  name: z.string().min(1),
  version: z.string().min(1),
  description: z.string().min(1),
  category: z.enum(["repair", "enhancement", "style", "creative"]),
  enabled: z.boolean().default(true),
  tags: z.array(z.string()).default([]),
  capabilities: z
    .array(
      z.object({
        name: z.string(),
        description: z.string(),
      }),
    )
    .default([]),
  parameters: z
    .array(
      z.object({
        key: z.string(),
        label: z.string(),
        type: z.enum(["string", "number", "boolean", "select"]),
        required: z.boolean(),
        defaultValue: z.union([z.string(), z.number(), z.boolean()]).optional(),
        options: z
          .array(
            z.object({
              value: z.string(),
              label: z.string(),
            }),
          )
          .optional(),
      }),
    )
    .default([]),
  models: z
    .array(
      z.object({
        model: z.string(),
        default: z.boolean().default(false),
      }),
    )
    .default([]),
  visibility: z.array(z.enum(["admin", "editor", "user"])).default(["admin", "editor", "user"]),
  provider: z.string().min(1),
  costTier: z.enum(["free", "standard", "premium"]).default("standard"),
  rating: z.number().min(0).max(5).default(0),
  usageCount: z.number().int().nonnegative().default(0),
});

export type ModuleListQuery = z.infer<typeof listQuerySchema>;

/**
 * Retrieves modules using query parameters from the API layer.
 *
 * @param params - Query parameters from request.
 * @returns Paginated module list result.
 */
export async function getModules(params: Record<string, unknown>) {
  const query = listQuerySchema.parse(params);

  const options: ListModulesOptions = {
    page: query.page,
    pageSize: query.pageSize,
    filter: {
      category: query.category,
      enabled: query.enabled,
      visibility: query.visibility,
      search: query.search,
      tags: query.tags,
    },
    sort: query.sort,
  };

  return listModules(options);
}

/**
 * Seeds the database with module definitions when absent.
 *
 * @param modules - Array of module payloads to upsert.
 * @returns Promise resolving once all modules are persisted.
 */
export async function seedModules(modules: Array<Record<string, unknown>>): Promise<void> {
  for (const modulePayload of modules) {
    const data = seedModuleSchema.parse(modulePayload);
    const existing = await findModuleByModuleId(data.moduleId);
    if (!existing) {
      await createModule(data);
    }
  }
}

export interface ModulePreview {
  moduleId: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  rating: number;
  costTier: string;
  provider: string;
  enabled: boolean;
}

/**
 * Maps modules into lightweight preview objects for front-end consumption.
 *
 * @param modules - Raw module documents from the database.
 * @returns Array of module preview objects.
 */
export function mapToModulePreviews(modules: ModuleDocument[]): ModulePreview[] {
  return modules.map((module) => ({
    moduleId: module.moduleId,
    name: module.name,
    description: module.description,
    category: module.category,
    tags: module.tags,
    rating: module.rating,
    costTier: module.costTier,
    provider: module.provider,
    enabled: module.enabled,
  }));
}

/**
 * Generates a module result preview by calling the configured image generation API.
 *
 * Currently uses Gemini 2.5 Flash Image Preview as the default image generator.
 * The system supports multiple image generation providers and can be extended
 * to use other models like DALL-E 3, Stable Diffusion, etc.
 *
 * @param prompt - Text prompt describing the desired image.
 * @param modelName - Optional model name to use. Defaults to "Gemini 2.5 Flash Image".
 * @returns Base64 encoded image string (data URL).
 */
export async function generateModuleResult(
  prompt: string,
  modelName: string = "Gemini 2.5 Flash Image"
): Promise<string> {
  try {
    // Determine the generator type from the model name
    const generatorType = getGeneratorType(modelName);

    if (!generatorType) {
      throw new Error(
        `Unsupported model: ${modelName}. Supported models: Gemini 2.5 Flash Image Preview, DALL-E 3`
      );
    }

    // Get the appropriate API key based on generator type
    let apiKey: string;
    switch (generatorType) {
      case "gemini-2.5-flash-image-preview":
        apiKey = env.GEMINI_API_KEY;
        break;
      case "dall-e-3":
        // TODO: Add OPENAI_API_KEY to env config when DALL-E 3 is needed
        throw new Error("DALL-E 3 requires OPENAI_API_KEY to be configured");
      default:
        throw new Error(`API key not configured for generator type: ${generatorType}`);
    }

    // Create the appropriate image generator
    const generator = createImageGenerator(generatorType, apiKey);

    // Generate the image
    const options: ImageGenerationOptions = {
      prompt,
      n: 1,
      size: "1024x1024", // Default size, can be customized
    };

    const result = await generator.generate(options);

    // Return the first generated image
    if (result.images.length === 0) {
      throw new Error("Image generator did not return any images");
    }

    return result.images[0];
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error(`Image generation failed (model: ${modelName}):`, errorMessage);
    
    // Check if it's a quota error - provide helpful context
    if (errorMessage.includes("quota") || errorMessage.includes("429")) {
      throw new Error(
        `API 配额限制：${errorMessage}\n\n` +
        `解决方案：\n` +
        `1. 等待配额重置（通常每天重置）\n` +
        `2. 检查配额使用情况：https://ai.dev/usage?tab=rate-limit\n` +
        `3. 考虑升级到付费计划以获取更多配额`
      );
    }
    
    throw new Error(`Failed to generate module result: ${errorMessage}`);
  }
}

