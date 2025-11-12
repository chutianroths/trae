export type StepStatus = 'pending' | 'processing' | 'success' | 'error';
export type UserRole = 'admin' | 'editor' | 'user';
export type ModuleCategory = 'repair' | 'enhancement' | 'style' | 'creative';

export interface EditStep {
  id: string;
  moduleId: string;
  moduleName: string;
  parameters: Record<string, any>;
  status: StepStatus;
  progress?: number;
  errorMessage?: string;
  startTime?: Date;
  endTime?: Date;
  processingTime?: number;
}

export interface EditModule {
  id: string;
  name: string;
  category: ModuleCategory;
  enabled: boolean;
  icon: string;
  description: string;
  requiresVPN: boolean;
  estimatedTime: number; // seconds
  supportedModels: string[];
}

export interface AIModel {
  name: string;
  provider: string;
  capabilities: string[];
  costPerImage: number;
  requiresVPN: boolean;
  region: 'domestic' | 'foreign';
  status: 'online' | 'offline';
  latency?: number;
}

export interface EditProject {
  id: string;
  name: string;
  originalImage: string | null;
  steps: EditStep[];
  currentStepIndex: number;
  status: 'draft' | 'processing' | 'completed' | 'error';
  createdAt: Date;
  updatedAt: Date;
}

export interface CompressionConfig {
  enabled: boolean;
  maxFileSize: number; // MB
  quality: number; // 0-100
  resize: {
    enabled: boolean;
    maxWidth: number;
    maxHeight: number;
  };
}

export interface VPNConfig {
  enabled: boolean;
  proxyType: 'system' | 'manual' | 'pac';
  modelSettings: Record<string, boolean>;
  autoSwitch: boolean;
}

export const STATUS_CONFIG = {
  pending: { color: '#CCCCCC', icon: '⏳', label: '等待中' },
  processing: { color: '#FFA500', icon: '🔄', label: '处理中' },
  success: { color: '#52C41A', icon: '✅', label: '完成' },
  error: { color: '#FF4D4F', icon: '❌', label: '错误' }
} as const;

export const EDIT_MODULES: EditModule[] = [
  {
    id: 'line-art-colorization',
    name: '线稿上色',
    category: 'creative',
    enabled: true,
    icon: '🎨',
    description: '自动识别线稿并智能上色',
    requiresVPN: false,
    estimatedTime: 8,
    supportedModels: ['wenxin', 'tongyi', 'gemini']
  },
  {
    id: 'object-removal',
    name: '人物消除',
    category: 'repair',
    enabled: true,
    icon: '🧹',
    description: '智能移除指定人物或物体',
    requiresVPN: false,
    estimatedTime: 10,
    supportedModels: ['gemini', 'dall_e']
  },
  {
    id: 'auto-lighting',
    name: '自动打光',
    category: 'enhancement',
    enabled: true,
    icon: '💡',
    description: '智能调整图片光影效果',
    requiresVPN: false,
    estimatedTime: 6,
    supportedModels: ['wenxin', 'tongyi']
  },
  {
    id: 'background-replace',
    name: '背景替换',
    category: 'creative',
    enabled: true,
    icon: '🖼️',
    description: '一键更换图片背景',
    requiresVPN: false,
    estimatedTime: 12,
    supportedModels: ['gemini', 'dall_e', 'wenxin']
  },
  {
    id: 'style-transfer',
    name: '风格转换',
    category: 'style',
    enabled: true,
    icon: '🎭',
    description: '转换为指定艺术风格',
    requiresVPN: false,
    estimatedTime: 15,
    supportedModels: ['gemini', 'dall_e']
  },
  {
    id: 'upscale',
    name: '画质增强',
    category: 'enhancement',
    enabled: true,
    icon: '📈',
    description: '超分辨率重建和细节恢复',
    requiresVPN: false,
    estimatedTime: 20,
    supportedModels: ['wenxin', 'tongyi']
  },
  {
    id: 'photo-restoration',
    name: '老照片修复',
    category: 'repair',
    enabled: true,
    icon: '📷',
    description: '破损修复和色彩还原',
    requiresVPN: false,
    estimatedTime: 18,
    supportedModels: ['wenxin', 'gemini']
  },
  {
    id: 'portrait-enhancement',
    name: '人像美化',
    category: 'enhancement',
    enabled: true,
    icon: '✨',
    description: '智能美颜和五官优化',
    requiresVPN: false,
    estimatedTime: 10,
    supportedModels: ['tongyi', 'wenxin']
  },
  {
    id: 'creative-generation',
    name: '创意生成',
    category: 'creative',
    enabled: true,
    icon: '🎪',
    description: '图像扩展和元素添加',
    requiresVPN: true,
    estimatedTime: 25,
    supportedModels: ['gemini', 'dall_e']
  },
  {
    id: 'effects-composite',
    name: '特效合成',
    category: 'creative',
    enabled: true,
    icon: '⚡',
    description: '光效和天气效果添加',
    requiresVPN: false,
    estimatedTime: 12,
    supportedModels: ['gemini', 'wenxin']
  }
];

export const AI_MODELS: AIModel[] = [
  {
    name: 'Gemini Pro',
    provider: 'Google',
    capabilities: ['image_analysis', 'generation'],
    costPerImage: 0.05,
    requiresVPN: true,
    region: 'foreign',
    status: 'online',
    latency: 2.3
  },
  {
    name: 'ChatGPT Vision',
    provider: 'OpenAI',
    capabilities: ['image_analysis'],
    costPerImage: 0.03,
    requiresVPN: true,
    region: 'foreign',
    status: 'online',
    latency: 1.8
  },
  {
    name: 'DALL-E 3',
    provider: 'OpenAI',
    capabilities: ['image_generation'],
    costPerImage: 0.08,
    requiresVPN: true,
    region: 'foreign',
    status: 'online',
    latency: 3.5
  },
  {
    name: '文心一言',
    provider: '百度',
    capabilities: ['image_analysis', 'generation'],
    costPerImage: 0.02,
    requiresVPN: false,
    region: 'domestic',
    status: 'online',
    latency: 1.2
  },
  {
    name: '通义千问',
    provider: '阿里',
    capabilities: ['image_analysis'],
    costPerImage: 0.015,
    requiresVPN: false,
    region: 'domestic',
    status: 'online',
    latency: 1.5
  },
  {
    name: '讯飞星火',
    provider: '讯飞',
    capabilities: ['image_analysis'],
    costPerImage: 0.018,
    requiresVPN: false,
    region: 'domestic',
    status: 'online',
    latency: 1.6
  }
];
