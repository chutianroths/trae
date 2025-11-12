export type ModuleCategory = "repair" | "enhancement" | "style" | "creative";

export interface ModuleCapability {
  name: string;
  description: string;
}

export interface ModuleParameter {
  key: string;
  label: string;
  type: "string" | "number" | "boolean" | "select";
  required: boolean;
  defaultValue?: string | number | boolean;
  options?: Array<{
    value: string;
    label: string;
  }>;
}

export interface ModuleModelConfig {
  model: string;
  default: boolean;
}

export interface ModuleDocument {
  _id: string;
  moduleId: string;
  name: string;
  version: string;
  description: string;
  category: ModuleCategory;
  enabled: boolean;
  tags: string[];
  capabilities: ModuleCapability[];
  parameters: ModuleParameter[];
  models: ModuleModelConfig[];
  visibility: Array<"admin" | "editor" | "user">;
  provider: string;
  costTier: "free" | "standard" | "premium";
  rating: number;
  usageCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateModuleInput = Omit<ModuleDocument, "_id" | "createdAt" | "updatedAt">;

export interface StoredModule extends Omit<ModuleDocument, "createdAt" | "updatedAt"> {
  createdAt: string;
  updatedAt: string;
}

export interface ModuleFilter {
  category?: ModuleCategory;
  enabled?: boolean;
  visibility?: "admin" | "editor" | "user";
  search?: string;
  tags?: string[];
}

export interface ModuleListResult {
  items: ModuleDocument[];
  total: number;
  page: number;
  pageSize: number;
}

