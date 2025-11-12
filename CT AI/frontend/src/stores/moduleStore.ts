import { create } from 'zustand';

import { apiRequest } from '@/services/apiClient';
import type { ModuleListResponse, ModulePreview } from '@/types/api';

export type ModuleSort = 'recent' | 'popular' | 'rating';
export type ModuleVisibility = 'admin' | 'editor' | 'user';

interface ModuleFilters {
  category?: string;
  tags?: string[];
  visibility?: ModuleVisibility;
  sort?: ModuleSort;
}

interface ModuleState {
  modules: ModulePreview[];
  isLoading: boolean;
  error?: string;
  page: number;
  pageSize: number;
  total: number;
  filters: ModuleFilters;
}

interface ModuleActions {
  fetchModules: (override?: Partial<ModuleFilters>) => Promise<void>;
  setFilter: (filters: Partial<ModuleFilters>) => void;
}

const initialState: ModuleState = {
  modules: [],
  isLoading: false,
  page: 1,
  pageSize: 20,
  total: 0,
  filters: {
    sort: 'recent',
  },
};

export const useModuleStore = create<ModuleState & ModuleActions>((set, get) => ({
  ...initialState,
  setFilter: (filters) =>
    set((state) => ({
      filters: {
        ...state.filters,
        ...filters,
      },
    })),
  fetchModules: async (override) => {
    const { filters, pageSize } = get();
    const mergedFilters = { ...filters, ...override };
    set({ isLoading: true, error: undefined });
    try {
      const response = await apiRequest<ModuleListResponse>('/api/modules', {
        query: {
          page: 1,
          pageSize,
          category: mergedFilters.category,
          tags: mergedFilters.tags?.join(','),
          visibility: mergedFilters.visibility,
          sort: mergedFilters.sort,
        },
      });

      set({
        modules: response.items,
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
