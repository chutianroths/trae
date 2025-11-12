import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { EditProject, EditStep, EditModule, VPNConfig, CompressionConfig, ApiKeys } from '../types';

interface AppState {
  // Project State
  currentProject: EditProject | null;
  projects: EditProject[];
  
  // UI State
  selectedModel: string;
  vpnConfig: VPNConfig;
  compressionConfig: CompressionConfig;
  sidebarCollapsed: boolean;
  apiKeys: ApiKeys;
  customModules: EditModule[];
  
  // Actions
  createProject: (name: string) => void;
  loadProject: (projectId: string) => void;
  updateProject: (updates: Partial<EditProject>) => void;
  
  addStep: (module: EditModule) => void;
  removeStep: (stepId: string) => void;
  updateStepStatus: (stepId: string, status: EditStep['status'], progress?: number) => void;
  reorderSteps: (fromIndex: number, toIndex: number) => void;
  
  uploadImage: (imageData: string) => void;
  setResultImage: (imageData: string | null) => void;
  executeStep: (stepId: string) => Promise<void>;
  executeAllSteps: () => Promise<void>;
  duplicateStep: (stepId: string) => void;
  skipStep: (stepId: string) => void;
  
  setSelectedModel: (model: string) => void;
  updateVPNConfig: (config: Partial<VPNConfig>) => void;
  updateCompressionConfig: (config: Partial<CompressionConfig>) => void;
  toggleSidebar: () => void;
  setApiKey: (provider: keyof ApiKeys, value: string) => void;
  resetApiKeys: () => void;
  addCustomModule: (module: Omit<EditModule, 'enabled' | 'id'> & { id?: string }) => void;
}

const defaultApiKeys: ApiKeys = {
  gemini: '',
  dalle3: '',
  sdxl: '',
  midjourney: '',
  firefly: '',
  wenxinyige: '',
  tongyiwanxiang: '',
  hunyuan: '',
  rishin: '',
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentProject: null,
      projects: [],
      selectedModel: '文心一格',
      vpnConfig: {
        enabled: false,
        proxyType: 'system',
        modelSettings: {},
        autoSwitch: true,
      },
      compressionConfig: {
        enabled: true,
        maxFileSize: 5,
        quality: 85,
        resize: {
          enabled: true,
          maxWidth: 2048,
          maxHeight: 2048,
        },
      },
      sidebarCollapsed: false,
      apiKeys: { ...defaultApiKeys },
      customModules: [],

      createProject: (name: string) => {
        const newProject: EditProject = {
          id: `project-${Date.now()}`,
          name,
          originalImage: null,
          resultImage: null,
          steps: [],
          currentStepIndex: -1,
          status: 'draft',
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        set((state) => ({
          currentProject: newProject,
          projects: [...state.projects, newProject],
        }));
      },

      loadProject: (projectId: string) => {
        const project = get().projects.find((p) => p.id === projectId);
        if (project) {
          set({ currentProject: project });
        }
      },

      updateProject: (updates: Partial<EditProject>) => {
        set((state) => {
          if (!state.currentProject) return state;

          const updatedProject = {
            ...state.currentProject,
            ...updates,
            updatedAt: new Date(),
          };

          return {
            currentProject: updatedProject,
            projects: state.projects.map((p) =>
              p.id === updatedProject.id ? updatedProject : p,
            ),
          };
        });
      },

      addStep: (module: EditModule) => {
        const newStep: EditStep = {
          id: `step-${Date.now()}`,
          moduleId: module.id,
          moduleName: module.name,
          parameters: {
            prompt: module.promptTemplate ?? '',
          },
          status: 'pending',
          progress: 0,
        };

        set((state) => {
          if (!state.currentProject) return state;

          const updatedSteps = [...state.currentProject.steps, newStep];
          return {
            currentProject: {
              ...state.currentProject,
              steps: updatedSteps,
              updatedAt: new Date(),
            },
          };
        });
      },

      removeStep: (stepId: string) => {
        set((state) => {
          if (!state.currentProject) return state;

          return {
            currentProject: {
              ...state.currentProject,
              steps: state.currentProject.steps.filter((s) => s.id !== stepId),
              updatedAt: new Date(),
            },
          };
        });
      },

      updateStepStatus: (stepId: string, status: EditStep['status'], progress?: number) => {
        set((state) => {
          if (!state.currentProject) return state;

          const updatedSteps = state.currentProject.steps.map((step) => {
            if (step.id === stepId) {
              const updates: Partial<EditStep> = { status, progress };

              if (status === 'processing' && !step.startTime) {
                updates.startTime = new Date();
              }

              if (status === 'success' || status === 'error') {
                updates.endTime = new Date();
                if (step.startTime) {
                  updates.processingTime =
                    (new Date().getTime() - step.startTime.getTime()) / 1000;
                }
              }

              return { ...step, ...updates };
            }
            return step;
          });

          return {
            currentProject: {
              ...state.currentProject,
              steps: updatedSteps,
              updatedAt: new Date(),
            },
          };
        });
      },

      reorderSteps: (fromIndex: number, toIndex: number) => {
        set((state) => {
          if (!state.currentProject) return state;

          const steps = [...state.currentProject.steps];
          const [movedStep] = steps.splice(fromIndex, 1);
          steps.splice(toIndex, 0, movedStep);

          return {
            currentProject: {
              ...state.currentProject,
              steps,
              updatedAt: new Date(),
            },
          };
        });
      },

      uploadImage: (imageData: string) => {
        set((state) => {
          const project: EditProject = state.currentProject ?? {
            id: `project-${Date.now()}`,
            name: '未命名项目',
            originalImage: null,
            resultImage: null,
            steps: [],
            currentStepIndex: -1,
            status: 'draft',
            createdAt: new Date(),
            updatedAt: new Date(),
          };

          const updatedProject: EditProject = {
            ...project,
            originalImage: imageData,
            resultImage: null,
            updatedAt: new Date(),
          };

          return {
            currentProject: updatedProject,
            projects: [
              ...state.projects.filter((item) => item.id !== updatedProject.id),
              updatedProject,
            ],
          };
        });
      },

      setResultImage: (imageData: string | null) => {
        set((state) => {
          if (!state.currentProject) return state;

          const updatedProject: EditProject = {
            ...state.currentProject,
            resultImage: imageData,
            updatedAt: new Date(),
          };

          return {
            currentProject: updatedProject,
            projects: state.projects.map((project) =>
              project.id === updatedProject.id ? updatedProject : project,
            ),
          };
        });
      },

      executeStep: async (stepId: string) => {
        const { currentProject, updateStepStatus, setResultImage } = get();
        if (!currentProject) return;

        const step = currentProject.steps.find((s) => s.id === stepId);
        if (!step) return;

        updateStepStatus(stepId, 'processing', 0);

        for (let i = 0; i <= 100; i += 10) {
          await new Promise((resolve) => setTimeout(resolve, 300));
          updateStepStatus(stepId, 'processing', i);
        }

        const success = Math.random() > 0.1;
        updateStepStatus(stepId, success ? 'success' : 'error', 100);

        if (!success) {
          set((state) => {
            if (!state.currentProject) return state;
            return {
              currentProject: {
                ...state.currentProject,
                steps: state.currentProject.steps.map((s) =>
                  s.id === stepId ? { ...s, errorMessage: '处理失败: API超时' } : s,
                ),
              },
            };
          });
          setResultImage(null);
        } else {
          setResultImage(currentProject.originalImage);
        }
      },

      executeAllSteps: async () => {
        const { currentProject, executeStep } = get();
        if (!currentProject) return;

        set((state) => ({
          currentProject: state.currentProject
            ? {
                ...state.currentProject,
                status: 'processing',
              }
            : null,
        }));

        for (const step of currentProject.steps) {
          if (step.status !== 'success') {
            await executeStep(step.id);
          }
        }

        set((state) => ({
          currentProject: state.currentProject
            ? {
                ...state.currentProject,
                status: 'completed',
              }
            : null,
        }));
      },

      duplicateStep: (stepId: string) => {
        set((state) => {
          const current = state.currentProject;
          if (!current) return state;

          const index = current.steps.findIndex((step) => step.id === stepId);
          if (index === -1) return state;

          const source = current.steps[index];
          const clonedStep: EditStep = {
            ...source,
            id: `step-${Date.now()}`,
            status: 'pending',
            progress: 0,
            errorMessage: undefined,
            startTime: undefined,
            endTime: undefined,
            processingTime: undefined,
          };

          const updatedSteps = [...current.steps];
          updatedSteps.splice(index + 1, 0, clonedStep);

          const updatedProject: EditProject = {
            ...current,
            steps: updatedSteps,
            updatedAt: new Date(),
          };

          return {
            currentProject: updatedProject,
            projects: state.projects.map((project) =>
              project.id === current.id ? updatedProject : project,
            ),
          };
        });
      },

      skipStep: (stepId: string) => {
        set((state) => {
          const current = state.currentProject;
          if (!current) return state;

          const updatedSteps = current.steps.map<EditStep>((step) =>
            step.id === stepId
              ? {
                  ...step,
                  status: 'success',
                  progress: 100,
                  endTime: new Date(),
                  processingTime: step.startTime
                    ? (new Date().getTime() - step.startTime.getTime()) / 1000
                    : undefined,
                } as EditStep
              : step,
          );

          const updatedProject: EditProject = {
            ...current,
            steps: updatedSteps,
            updatedAt: new Date(),
          };

          return {
            currentProject: updatedProject,
            projects: state.projects.map((project) =>
              project.id === current.id ? updatedProject : project,
            ),
          };
        });
      },

      setSelectedModel: (model: string) => set({ selectedModel: model }),

      updateVPNConfig: (config: Partial<VPNConfig>) =>
        set((state) => ({ vpnConfig: { ...state.vpnConfig, ...config } })),

      updateCompressionConfig: (config: Partial<CompressionConfig>) =>
        set((state) => ({
          compressionConfig: { ...state.compressionConfig, ...config },
        })),

      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

      setApiKey: (provider, value) =>
        set((state) => ({
          apiKeys: {
            ...state.apiKeys,
            [provider]: value,
          },
        })),

      resetApiKeys: () =>
        set({
          apiKeys: { ...defaultApiKeys },
        }),

      addCustomModule: (module) =>
        set((state) => {
          const id = module.id ?? `custom-module-${Date.now()}`;
          const newModule: EditModule = {
            ...module,
            id,
            enabled: true,
          };

          const existsIndex = state.customModules.findIndex((item) => item.id === id);
          if (existsIndex >= 0) {
            const nextModules = [...state.customModules];
            nextModules[existsIndex] = newModule;
            return { customModules: nextModules };
          }

          return {
            customModules: [...state.customModules, newModule],
          };
        }),
    }),
    {
      name: 'ct-ai-app-store',
      partialize: (state) => ({
        apiKeys: state.apiKeys,
        customModules: state.customModules,
      }),
    },
  ),
);
