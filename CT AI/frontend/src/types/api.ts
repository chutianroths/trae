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

export interface ModulePagination {
  total: number;
  page: number;
  pageSize: number;
}

export interface ModuleListResponse {
  pagination: ModulePagination;
  items: ModulePreview[];
}

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

export interface PromptPagination {
  total: number;
  page: number;
  pageSize: number;
}

export interface PromptListResponse {
  pagination: PromptPagination;
  items: PromptPreview[];
}
