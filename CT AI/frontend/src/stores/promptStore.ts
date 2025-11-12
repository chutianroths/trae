import { create } from 'zustand';

import { apiRequest } from '@/services/apiClient';
import type { PromptListResponse, PromptPreview } from '@/types/api';

export type PromptSort = 'recent' | 'popular' | 'success';

interface PromptFilters {
  category?: string;
  visibility?: string;
  accessLevel?: string;
  tags?: string[];
  sort?: PromptSort;
}

interface PromptState {
  prompts: PromptPreview[];
  isLoading: boolean;
  error?: string;
  page: number;
  pageSize: number;
  total: number;
  filters: PromptFilters;
}

interface PromptActions {
  fetchPrompts: (override?: Partial<PromptFilters>) => Promise<void>;
  setFilters: (filters: Partial<PromptFilters>) => void;
}

const initialState: PromptState = {
  prompts: [],
  isLoading: false,
  page: 1,
  pageSize: 20,
  total: 0,
  filters: {
    sort: 'recent',
  },
};

export const usePromptStore = create<PromptState & PromptActions>((set, get) => ({
  ...initialState,
  setFilters: (filters) =>
    set((state) => ({
      filters: {
        ...state.filters,
        ...filters,
      },
    })),
  fetchPrompts: async (override) => {
    const { filters, pageSize } = get();
    const mergedFilters = { ...filters, ...override };
    set({ isLoading: true, error: undefined });
    try {
      const response = await apiRequest<PromptListResponse>('/api/prompts', {
        query: {
          page: 1,
          pageSize,
          category: mergedFilters.category,
          visibility: mergedFilters.visibility,
          accessLevel: mergedFilters.accessLevel,
          tags: mergedFilters.tags?.join(','),
          sort: mergedFilters.sort,
        },
      });

      set({
        prompts: response.items,
        total: response.pagination.total,
        page: response.pagination.page,
        pageSize: response.pagination.pageSize,
        filters: mergedFilters,
        isLoading: false,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: (error as Error).message,
      });
    }
  },
}));
