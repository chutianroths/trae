import { z } from "zod";

import {
  createPrompt,
  findPromptByPromptId,
  listPrompts,
  updatePromptUsage,
  type ListPromptsOptions,
} from "@/repositories/promptRepository";
import type { PromptDocument } from "@/types/prompt";

const listQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  pageSize: z.coerce.number().int().positive().max(100).optional(),
  category: z.string().min(1).optional(),
  visibility: z.enum(["public", "private", "system"]).optional(),
  accessLevel: z.enum(["admin", "editor", "user"]).optional(),
  search: z.string().min(1).optional(),
  tags: z
    .string()
    .transform((value) => value.split(",").map((tag) => tag.trim()).filter(Boolean))
    .optional(),
  sort: z.enum(["recent", "popular", "success"]).optional(),
});

const createPromptSchema = z.object({
  promptId: z.string().min(1),
  name: z.string().min(1),
  content: z.string().min(1),
  category: z.string().min(1),
  visibility: z.enum(["public", "private", "system"]).default("public"),
  accessLevel: z.array(z.enum(["admin", "editor", "user"])).min(1),
  createdBy: z.string().min(1),
  tags: z.array(z.string()).default([]),
});

export interface PromptPreview {
  promptId: string;
  name: string;
  category: string;
  visibility: string;
  accessLevel: string[];
  usageCount: number;
  successRate: number;
  tags: string[];
}

const seedPrompts = [
  {
    promptId: "portrait-enhance-basic",
    name: "人像增强基础版",
    content:
      "Please enhance the portrait with natural skin retouching, preserve facial details and deliver a high-resolution output.",
    category: "portrait",
    visibility: "public",
    accessLevel: ["admin", "editor", "user"],
    createdBy: "system",
    tags: ["portrait", "enhancement", "retouch"],
  },
  {
    promptId: "style-transfer-neo-noir",
    name: "霓虹黑色风格转换",
    content:
      "Transform the image into a neo-noir aesthetic with deep shadows, neon highlights, and cinematic color grading.",
    category: "style",
    visibility: "system",
    accessLevel: ["admin", "editor"],
    createdBy: "system",
    tags: ["style", "noir", "creative"],
  },
  {
    promptId: "background-cleanup",
    name: "背景清理与抠图",
    content:
      "Isolate the main subject, remove background artifacts, and provide a transparent or clean background layer.",
    category: "cleanup",
    visibility: "public",
    accessLevel: ["admin", "editor", "user"],
    createdBy: "system",
    tags: ["cleanup", "background", "segmentation"],
  },
];

export async function ensurePromptSeeds(): Promise<void> {
  for (const prompt of seedPrompts) {
    const exists = await findPromptByPromptId(prompt.promptId);
    if (!exists) {
      await createPrompt(prompt);
    }
  }
}

export async function getPrompts(params: Record<string, unknown>) {
  const query = listQuerySchema.parse(params);
  const options: ListPromptsOptions = {
    page: query.page,
    pageSize: query.pageSize,
    filter: {
      category: query.category,
      visibility: query.visibility,
      accessLevel: query.accessLevel,
      search: query.search,
      tags: query.tags,
    },
    sort: query.sort,
  };

  return listPrompts(options);
}

export async function createPromptEntry(payload: unknown) {
  const data = createPromptSchema.parse(payload);
  const existing = await findPromptByPromptId(data.promptId);
  if (existing) {
    throw new Error("Prompt ID already exists");
  }
  return createPrompt(data);
}

export async function trackPromptUsage(promptId: string, success: boolean) {
  await updatePromptUsage(promptId, success);
}

export function mapToPromptPreviews(prompts: PromptDocument[]): PromptPreview[] {
  return prompts.map((prompt) => ({
    promptId: prompt.promptId,
    name: prompt.name,
    category: prompt.category,
    visibility: prompt.visibility,
    accessLevel: prompt.accessLevel,
    usageCount: prompt.usageCount,
    successRate: prompt.successRate,
    tags: prompt.tags,
  }));
}

