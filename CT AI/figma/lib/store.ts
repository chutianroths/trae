import { create } from 'zustand';
import { EditProject, EditStep, EditModule, AIModel, VPNConfig, CompressionConfig } from '../types';

interface AppState {
  // Project State
  currentProject: EditProject | null;
  projects: EditProject[];
  
  // UI State
  selectedModel: string;
  vpnConfig: VPNConfig;
  compressionConfig: CompressionConfig;
  sidebarCollapsed: boolean;
  
  // Actions
  createProject: (name: string) => void;
  loadProject: (projectId: string) => void;
  updateProject: (updates: Partial<EditProject>) => void;
  
  addStep: (module: EditModule) => void;
  removeStep: (stepId: string) => void;
  updateStepStatus: (stepId: string, status: EditStep['status'], progress?: number) => void;
  reorderSteps: (fromIndex: number, toIndex: number) => void;
  
  uploadImage: (imageData: string) => void;
  executeStep: (stepId: string) => Promise<void>;
  executeAllSteps: () => Promise<void>;
  
  setSelectedModel: (model: string) => void;
  updateVPNConfig: (config: Partial<VPNConfig>) => void;
  updateCompressionConfig: (config: Partial<CompressionConfig>) => void;
  toggleSidebar: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  currentProject: null,
  projects: [],
  selectedModel: '文心一言',
  vpnConfig: {
    enabled: false,
    proxyType: 'system',
    modelSettings: {},
    autoSwitch: true
  },
  compressionConfig: {
    enabled: true,
    maxFileSize: 5,
    quality: 85,
    resize: {
      enabled: true,
      maxWidth: 2048,
      maxHeight: 2048
    }
  },
  sidebarCollapsed: false,

  createProject: (name: string) => {
    const newProject: EditProject = {
      id: `project-${Date.now()}`,
      name,
      originalImage: null,
      steps: [],
      currentStepIndex: -1,
      status: 'draft',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    set((state) => ({
      currentProject: newProject,
      projects: [...state.projects, newProject]
    }));
  },

  loadProject: (projectId: string) => {
    const project = get().projects.find(p => p.id === projectId);
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
        updatedAt: new Date()
      };
      
      return {
        currentProject: updatedProject,
        projects: state.projects.map(p => 
          p.id === updatedProject.id ? updatedProject : p
        )
      };
    });
  },

  addStep: (module: EditModule) => {
    const newStep: EditStep = {
      id: `step-${Date.now()}`,
      moduleId: module.id,
      moduleName: module.name,
      parameters: {},
      status: 'pending',
      progress: 0
    };
    
    set((state) => {
      if (!state.currentProject) return state;
      
      const updatedSteps = [...state.currentProject.steps, newStep];
      return {
        currentProject: {
          ...state.currentProject,
          steps: updatedSteps,
          updatedAt: new Date()
        }
      };
    });
  },

  removeStep: (stepId: string) => {
    set((state) => {
      if (!state.currentProject) return state;
      
      return {
        currentProject: {
          ...state.currentProject,
          steps: state.currentProject.steps.filter(s => s.id !== stepId),
          updatedAt: new Date()
        }
      };
    });
  },

  updateStepStatus: (stepId: string, status: EditStep['status'], progress?: number) => {
    set((state) => {
      if (!state.currentProject) return state;
      
      const updatedSteps = state.currentProject.steps.map(step => {
        if (step.id === stepId) {
          const updates: Partial<EditStep> = { status, progress };
          
          if (status === 'processing' && !step.startTime) {
            updates.startTime = new Date();
          }
          
          if (status === 'success' || status === 'error') {
            updates.endTime = new Date();
            if (step.startTime) {
              updates.processingTime = (new Date().getTime() - step.startTime.getTime()) / 1000;
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
          updatedAt: new Date()
        }
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
          updatedAt: new Date()
        }
      };
    });
  },

  uploadImage: (imageData: string) => {
    set((state) => {
      if (!state.currentProject) return state;
      
      return {
        currentProject: {
          ...state.currentProject,
          originalImage: imageData,
          updatedAt: new Date()
        }
      };
    });
  },

  executeStep: async (stepId: string) => {
    const { currentProject, updateStepStatus } = get();
    if (!currentProject) return;
    
    const step = currentProject.steps.find(s => s.id === stepId);
    if (!step) return;
    
    // Simulate API processing
    updateStepStatus(stepId, 'processing', 0);
    
    // Simulate progress updates
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 300));
      updateStepStatus(stepId, 'processing', i);
    }
    
    // Random success/error for demo
    const success = Math.random() > 0.1;
    updateStepStatus(stepId, success ? 'success' : 'error', 100);
    
    if (!success) {
      set((state) => {
        if (!state.currentProject) return state;
        return {
          currentProject: {
            ...state.currentProject,
            steps: state.currentProject.steps.map(s =>
              s.id === stepId ? { ...s, errorMessage: '处理失败: API超时' } : s
            )
          }
        };
      });
    }
  },

  executeAllSteps: async () => {
    const { currentProject, executeStep } = get();
    if (!currentProject) return;
    
    set((state) => ({
      currentProject: state.currentProject ? {
        ...state.currentProject,
        status: 'processing'
      } : null
    }));
    
    for (const step of currentProject.steps) {
      if (step.status !== 'success') {
        await executeStep(step.id);
      }
    }
    
    set((state) => ({
      currentProject: state.currentProject ? {
        ...state.currentProject,
        status: 'completed'
      } : null
    }));
  },

  setSelectedModel: (model: string) => set({ selectedModel: model }),
  
  updateVPNConfig: (config: Partial<VPNConfig>) => 
    set((state) => ({ vpnConfig: { ...state.vpnConfig, ...config } })),
  
  updateCompressionConfig: (config: Partial<CompressionConfig>) =>
    set((state) => ({ compressionConfig: { ...state.compressionConfig, ...config } })),
  
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed }))
}));