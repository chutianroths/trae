import { randomUUID } from "crypto";

import { loadPrompts, savePrompts } from "@/lib/localDb";
import type {
  CreatePromptInput,
  PromptDocument,
  PromptFilter,
  PromptListResult,
  StoredPrompt,
} from "@/types/prompt";

export interface ListPromptsOptions {
  page?: number;
  pageSize?: number;
  filter?: PromptFilter;
  sort?: "recent" | "popular" | "success";
}

function toPrompt(stored: StoredPrompt): PromptDocument {
  return {
    ...stored,
    createdAt: new Date(stored.createdAt),
    updatedAt: new Date(stored.updatedAt),
  };
}

function toStored(prompt: PromptDocument): StoredPrompt {
  return {
    ...prompt,
    createdAt: prompt.createdAt.toISOString(),
    updatedAt: prompt.updatedAt.toISOString(),
  };
}

function applyFilter(prompts: PromptDocument[], filter: PromptFilter = {}): PromptDocument[] {
  return prompts.filter((prompt) => {
    if (filter.category && prompt.category !== filter.category) {
      return false;
    }
    if (filter.visibility && prompt.visibility !== filter.visibility) {
      return false;
    }
    if (filter.accessLevel && !prompt.accessLevel.includes(filter.accessLevel)) {
      return false;
    }
    if (filter.search) {
      const search = filter.search.toLowerCase();
      const matches =
        prompt.name.toLowerCase().includes(search) ||
        prompt.content.toLowerCase().includes(search) ||
        prompt.tags.some((tag) => tag.toLowerCase().includes(search));
      if (!matches) {
        return false;
      }
    }
    if (filter.tags && filter.tags.length > 0) {
      const hasAllTags = filter.tags.every((tag) => prompt.tags.includes(tag));
      if (!hasAllTags) {
        return false;
      }
    }
    return true;
  });
}

function sortPrompts(prompts: PromptDocument[], sort?: ListPromptsOptions["sort"]) {
  const sorted = [...prompts];
  switch (sort) {
    case "popular":
      sorted.sort((a, b) => b.usageCount - a.usageCount);
      break;
    case "success":
      sorted.sort((a, b) => b.successRate - a.successRate);
      break;
    default:
      sorted.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  }
  return sorted;
}

export async function listPrompts(options: ListPromptsOptions): Promise<PromptListResult> {
  const page = Math.max(1, options.page ?? 1);
  const pageSize = Math.min(100, options.pageSize ?? 20);

  const storedPrompts = await loadPrompts();
  const prompts = storedPrompts.map(toPrompt);
  const filtered = applyFilter(prompts, options.filter);
  const sorted = sortPrompts(filtered, options.sort);

  const start = (page - 1) * pageSize;
  const items = sorted.slice(start, start + pageSize);

  return {
    items,
    total: filtered.length,
    page,
    pageSize,
  };
}

export async function findPromptByPromptId(promptId: string): Promise<PromptDocument | null> {
  const storedPrompts = await loadPrompts();
  const match = storedPrompts.find((prompt) => prompt.promptId === promptId);
  return match ? toPrompt(match) : null;
}

export async function createPrompt(input: CreatePromptInput): Promise<PromptDocument> {
  const storedPrompts = await loadPrompts();

  if (storedPrompts.some((prompt) => prompt.promptId === input.promptId)) {
    throw new Error("Prompt ID already exists");
  }

  const now = new Date();
  const prompt: PromptDocument = {
    ...input,
    _id: randomUUID(),
    usageCount: 0,
    successRate: 0,
    createdAt: now,
    updatedAt: now,
  };

  storedPrompts.push(toStored(prompt));
  await savePrompts(storedPrompts);
  return prompt;
}

export async function updatePromptUsage(promptId: string, success: boolean): Promise<void> {
  const storedPrompts = await loadPrompts();
  const index = storedPrompts.findIndex((prompt) => prompt.promptId === promptId);
  if (index === -1) {
    return;
  }

  const prompt = toPrompt(storedPrompts[index]);
  const newUsage = prompt.usageCount + 1;
  const newSuccessRate = success
    ? (prompt.successRate * prompt.usageCount + 1) / newUsage
    : (prompt.successRate * prompt.usageCount) / newUsage;

  const updated: PromptDocument = {
    ...prompt,
    usageCount: newUsage,
    successRate: Number(newSuccessRate.toFixed(2)),
    updatedAt: new Date(),
  };

  storedPrompts[index] = toStored(updated);
  await savePrompts(storedPrompts);
}

