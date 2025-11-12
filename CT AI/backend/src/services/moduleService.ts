import { getGeminiModel } from "@/lib/aiClient";
import { z } from "zod";

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
 * Generates a module result preview by calling Gemini with the given prompt.
 *
 * @param prompt - Text prompt to send to the Gemini image endpoint.
 * @returns Base64 encoded image string.
 */
export async function generateModuleResult(prompt: string): Promise<string> {
  const model = getGeminiModel();
  const result = await model.generateContent({
    contents: [
      {
        role: "user",
        parts: [{ text: prompt }],
      },
    ],
  });

  const candidates = result.response.candidates ?? [];
  const imagePart = candidates
    .flatMap((candidate) => candidate.content?.parts ?? [])
    .find((part) => part.inlineData?.mimeType?.startsWith("image/"));

  if (!imagePart?.inlineData?.data) {
    throw new Error("Gemini did not return image data");
  }

  return `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`;
}

