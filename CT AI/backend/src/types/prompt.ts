import type { UserRole } from "@/types/user";

export type PromptVisibility = "public" | "private" | "system";

export interface PromptDocument {
  _id: string;
  promptId: string;
  name: string;
  content: string;
  category: string;
  visibility: PromptVisibility;
  accessLevel: UserRole[];
  createdBy: string;
  usageCount: number;
  successRate: number;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePromptInput {
  promptId: string;
  name: string;
  content: string;
  category: string;
  visibility: PromptVisibility;
  accessLevel: UserRole[];
  createdBy: string;
  tags: string[];
}

export interface PromptFilter {
  category?: string;
  visibility?: PromptVisibility;
  accessLevel?: UserRole;
  search?: string;
  tags?: string[];
}

export interface PromptListResult {
  items: PromptDocument[];
  total: number;
  page: number;
  pageSize: number;
}

export interface StoredPrompt extends Omit<PromptDocument, "createdAt" | "updatedAt"> {
  createdAt: string;
  updatedAt: string;
}

