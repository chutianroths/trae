export type StepStatus = 'pending' | 'processing' | 'success' | 'error';
export type UserRole = 'admin' | 'editor' | 'user';
export type ModuleCategory = 'repair' | 'enhancement' | 'style' | 'creative';

export type AiApiKeyId =
  | 'gemini'
  | 'dalle3'
  | 'sdxl'
  | 'midjourney'
  | 'firefly'
  | 'wenxinyige'
  | 'tongyiwanxiang'
  | 'hunyuan'
  | 'rishin';

export interface EditStep {
  id: string;
  moduleId: string;
  moduleName: string;
  parameters: Record<string, unknown>;
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
  promptTemplate: string;
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
  apiKeyId: AiApiKeyId;
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
  resultImage?: string | null;
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

export type ApiKeys = Record<AiApiKeyId, string>;

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
    supportedModels: ['wenxinyige', 'tongyiwanxiang', 'gemini'],
    promptTemplate: '请根据上传的线稿自动填充配色，保持角色肤色自然且符合原作风格。'
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
    supportedModels: ['gemini', 'dall_e'],
    promptTemplate: '移除图像中指定的物体，并自然补全背景纹理与光影。'
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
    supportedModels: ['wenxinyige', 'tongyiwanxiang'],
    promptTemplate: '调整图像光影，增强主体亮度和对比度，保持整体色温自然。'
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
    supportedModels: ['gemini', 'dalle3', 'wenxinyige'],
    promptTemplate: '替换背景为现代日式室内场景，人物光影需与新背景一致。'
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
    supportedModels: ['gemini', 'dall_e'],
    promptTemplate: '将图像转换为赛博朋克风格，突出霓虹灯与高对比度效果。'
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
    supportedModels: ['wenxinyige', 'tongyiwanxiang'],
    promptTemplate: '对图像执行超分辨率重建，强化细节并减少噪点。'
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
    supportedModels: ['wenxinyige', 'gemini'],
    promptTemplate: '修复破损、划痕与褪色区域，恢复原始色彩。'
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
    supportedModels: ['tongyiwanxiang', 'wenxinyige'],
    promptTemplate: '对人物进行自然磨皮、五官优化与肤色校正，保持真实质感。'
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
    supportedModels: ['gemini', 'dall_e'],
    promptTemplate: '根据提示词生成延伸画面，并保持主体与背景协调。'
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
    supportedModels: ['gemini', 'wenxinyige'],
    promptTemplate: '为图像添加电影级光效与粒子特效，强化氛围表现。'
  }
];

export const AI_MODELS: AIModel[] = [
  {
    name: 'Gemini 2.5 Flash Image',
    provider: 'Google',
    capabilities: ['image_generation', 'image_editing', 'inpainting'],
    costPerImage: 0.02,
    requiresVPN: true,
    region: 'foreign',
    status: 'online',
    latency: 2.2,
    apiKeyId: 'gemini',
  },
  {
    name: 'DALL·E 3',
    provider: 'OpenAI',
    capabilities: ['image_generation', 'image_editing'],
    costPerImage: 0.08,
    requiresVPN: true,
    region: 'foreign',
    status: 'online',
    latency: 3.1,
    apiKeyId: 'dalle3',
  },
  {
    name: 'Stable Diffusion XL',
    provider: 'Stability AI',
    capabilities: ['image_generation', 'image_editing', 'inpainting'],
    costPerImage: 0.01,
    requiresVPN: true,
    region: 'foreign',
    status: 'online',
    latency: 2.8,
    apiKeyId: 'sdxl',
  },
  {
    name: 'Midjourney v6',
    provider: 'Midjourney',
    capabilities: ['image_generation', 'image_editing'],
    costPerImage: 0.04,
    requiresVPN: true,
    region: 'foreign',
    status: 'online',
    latency: 4.5,
    apiKeyId: 'midjourney',
  },
  {
    name: 'Adobe Firefly 3',
    provider: 'Adobe',
    capabilities: ['image_generation', 'image_editing'],
    costPerImage: 0.06,
    requiresVPN: true,
    region: 'foreign',
    status: 'online',
    latency: 2.9,
    apiKeyId: 'firefly',
  },
  {
    name: '文心一格',
    provider: '百度',
    capabilities: ['image_generation', 'image_editing', 'style_transfer'],
    costPerImage: 0.02,
    requiresVPN: false,
    region: 'domestic',
    status: 'online',
    latency: 1.2,
    apiKeyId: 'wenxinyige',
  },
  {
    name: '通义万相',
    provider: '阿里巴巴',
    capabilities: ['image_generation', 'image_editing', 'inpainting'],
    costPerImage: 0.018,
    requiresVPN: false,
    region: 'domestic',
    status: 'online',
    latency: 1.4,
    apiKeyId: 'tongyiwanxiang',
  },
  {
    name: '混元图像',
    provider: '腾讯',
    capabilities: ['image_generation', 'image_editing'],
    costPerImage: 0.02,
    requiresVPN: false,
    region: 'domestic',
    status: 'online',
    latency: 1.6,
    apiKeyId: 'hunyuan',
  },
  {
    name: '日日新·星辰',
    provider: '商汤',
    capabilities: ['image_generation', 'image_editing', 'photo_restoration'],
    costPerImage: 0.025,
    requiresVPN: false,
    region: 'domestic',
    status: 'online',
    latency: 1.7,
    apiKeyId: 'rishin',
  },
];

