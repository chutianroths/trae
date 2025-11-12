import { randomUUID } from "crypto";

import { loadModules, saveModules } from "@/lib/localDb";
import type {
  CreateModuleInput,
  ModuleDocument,
  ModuleFilter,
  ModuleListResult,
  StoredModule,
} from "@/types/module";

export interface ListModulesOptions {
  page?: number;
  pageSize?: number;
  filter?: ModuleFilter;
  sort?: "recent" | "popular" | "rating";
}

function toModule(stored: StoredModule): ModuleDocument {
  return {
    ...stored,
    createdAt: new Date(stored.createdAt),
    updatedAt: new Date(stored.updatedAt),
  };
}

function toStored(module: ModuleDocument): StoredModule {
  return {
    ...module,
    createdAt: module.createdAt.toISOString(),
    updatedAt: module.updatedAt.toISOString(),
  };
}

function applyFilter(modules: ModuleDocument[], filter: ModuleFilter = {}): ModuleDocument[] {
  return modules.filter((module) => {
    if (filter.category && module.category !== filter.category) {
      return false;
    }
    if (typeof filter.enabled === "boolean" && module.enabled !== filter.enabled) {
      return false;
    }
    if (filter.visibility && !module.visibility.includes(filter.visibility)) {
      return false;
    }
    if (filter.search) {
      const search = filter.search.toLowerCase();
      const matches =
        module.name.toLowerCase().includes(search) ||
        module.description.toLowerCase().includes(search) ||
        module.tags.some((tag) => tag.toLowerCase().includes(search));
      if (!matches) {
        return false;
      }
    }
    if (filter.tags && filter.tags.length > 0) {
      const hasAllTags = filter.tags.every((tag) => module.tags.includes(tag));
      if (!hasAllTags) {
        return false;
      }
    }
    return true;
  });
}

function sortModules(modules: ModuleDocument[], sort?: ListModulesOptions["sort"]) {
  const sorted = [...modules];
  switch (sort) {
    case "popular":
      sorted.sort((a, b) => b.usageCount - a.usageCount);
      break;
    case "rating":
      sorted.sort((a, b) => b.rating - a.rating);
      break;
    default:
      sorted.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  }
  return sorted;
}

export async function listModules(options: ListModulesOptions): Promise<ModuleListResult> {
  const page = Math.max(1, options.page ?? 1);
  const pageSize = Math.min(100, options.pageSize ?? 20);

  const storedModules = await loadModules();
  const modules = storedModules.map(toModule);

  const filtered = applyFilter(modules, options.filter);
  const sorted = sortModules(filtered, options.sort);

  const start = (page - 1) * pageSize;
  const items = sorted.slice(start, start + pageSize);

  return {
    items,
    total: filtered.length,
    page,
    pageSize,
  };
}

export async function findModuleByModuleId(moduleId: string): Promise<ModuleDocument | null> {
  const storedModules = await loadModules();
  const match = storedModules.find((module) => module.moduleId === moduleId);
  return match ? toModule(match) : null;
}

export async function createModule(input: CreateModuleInput): Promise<ModuleDocument> {
  const storedModules = await loadModules();

  if (storedModules.some((module) => module.moduleId === input.moduleId)) {
    throw new Error("Module already exists");
  }

  const now = new Date();
  const newModule: ModuleDocument = {
    ...input,
    _id: randomUUID(),
    createdAt: now,
    updatedAt: now,
  };

  storedModules.push(toStored(newModule));
  await saveModules(storedModules);
  return newModule;
}

export async function updateModule(
  moduleId: string,
  updates: Partial<CreateModuleInput>,
): Promise<void> {
  const storedModules = await loadModules();
  const index = storedModules.findIndex((module) => module.moduleId === moduleId);
  if (index === -1) {
    throw new Error("Module not found");
  }

  const current = toModule(storedModules[index]);
  const updated: ModuleDocument = {
    ...current,
    ...updates,
    updatedAt: new Date(),
  };

  storedModules[index] = toStored(updated);
  await saveModules(storedModules);
}

