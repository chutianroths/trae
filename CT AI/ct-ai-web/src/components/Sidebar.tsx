import { useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { Folder, Boxes, ChevronRight, Sparkles, ShieldAlert } from 'lucide-react';
import { EDIT_MODULES, AI_MODELS } from '../types';
import type { ModuleCategory, EditModule } from '../types';
import { useAppStore } from '../lib/store';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';

export function Sidebar() {
  const [activeTab, setActiveTab] = useState<'modules' | 'projects' | 'templates' | 'history'>('modules');
  const [selectedCategory, setSelectedCategory] = useState<ModuleCategory | 'all'>('all');
  const { addStep, selectedModel, setSelectedModel, customModules, addCustomModule } = useAppStore();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formState, setFormState] = useState<{
    id?: string;
    name: string;
    category: ModuleCategory;
    icon: string;
    description: string;
    requiresVPN: boolean;
    estimatedTime: number;
    promptTemplate: string;
    supportedModels: string;
  }>({
    id: undefined,
    name: '',
    category: 'creative',
    icon: '✨',
    description: '',
    requiresVPN: false,
    estimatedTime: 10,
    promptTemplate: '',
    supportedModels: 'wenxinyige',
  });

  const modules = useMemo(() => {
    const map = new Map<string, EditModule>();
    EDIT_MODULES.forEach((module) => map.set(module.id, module));
    customModules.forEach((module) => map.set(module.id, module));
    return Array.from(map.values());
  }, [customModules]);
  const isEditing = Boolean(formState.id);

  const categories = useMemo(
    () => [
      { id: 'all' as const, label: '全部', count: modules.length },
      { id: 'repair' as const, label: '修复', count: modules.filter((m) => m.category === 'repair').length },
      { id: 'enhancement' as const, label: '增强', count: modules.filter((m) => m.category === 'enhancement').length },
      { id: 'style' as const, label: '风格', count: modules.filter((m) => m.category === 'style').length },
      { id: 'creative' as const, label: '创意', count: modules.filter((m) => m.category === 'creative').length },
    ],
    [modules],
  );

  const filteredModules =
    selectedCategory === 'all' ? modules : modules.filter((m) => m.category === selectedCategory);
  const activeModel = useMemo(
    () => AI_MODELS.find((model) => model.name === selectedModel),
    [selectedModel],
  );

  const handleCreateModule = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formState.name.trim() || !formState.promptTemplate.trim()) {
      return;
    }

    const supportedModels = formState.supportedModels
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);

    addCustomModule({
      id: formState.id,
      name: formState.name.trim(),
      category: formState.category,
      icon: formState.icon || '✨',
      description: formState.description.trim() || '自定义工作流模块',
      requiresVPN: formState.requiresVPN,
      estimatedTime: Number.isNaN(formState.estimatedTime) ? 10 : formState.estimatedTime,
      supportedModels: supportedModels.length > 0 ? supportedModels : ['wenxinyige'],
      promptTemplate: formState.promptTemplate.trim(),
    });

    setFormState({
      id: undefined,
      name: '',
      category: 'creative',
      icon: '✨',
      description: '',
      requiresVPN: false,
      estimatedTime: 10,
      promptTemplate: '',
      supportedModels: 'wenxin',
    });
    setIsAddModalOpen(false);
  };

  return (
    <aside className="w-80 border-r bg-gray-50">
      <div className="flex h-full flex-col">
        {/* Tab Navigation */}
        <div className="border-b bg-white p-4">
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant={activeTab === 'modules' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('modules')}
            >
              <Boxes className="size-4" />
              编辑模块
            </Button>
            <Button
              variant={activeTab === 'projects' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('projects')}
            >
              <Folder className="size-4" />
              项目
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            {activeTab === 'modules' && (
              <div className="p-4">
                {/* Category Filter */}
                <div className="mb-4">
                  <p className="mb-2 text-gray-500">分类</p>
                  <div className="flex flex-wrap gap-2">
                    {categories.map(cat => (
                      <Button
                        key={cat.id}
                        variant={selectedCategory === cat.id ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedCategory(cat.id)}
                      >
                        {cat.label}
                        <Badge variant="secondary" className="ml-1">
                          {cat.count}
                        </Badge>
                      </Button>
                    ))}
                  </div>
                </div>

                <Separator className="my-4" />

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    setFormState({
                      id: undefined,
                      name: '',
                      category: 'creative',
                      icon: '✨',
                      description: '',
                      requiresVPN: false,
                      estimatedTime: 10,
                      promptTemplate: '',
                      supportedModels: 'wenxinyige',
                    });
                    setIsAddModalOpen(true);
                  }}
                >
                  <Sparkles className="mr-2 size-4" />
                  创建自定义模块
                </Button>

                <Separator className="my-4" />

                {/* Modules List */}
                <div className="space-y-2">
                  <p className="mb-2 text-gray-500">可用模块</p>
                  {filteredModules.map(module => {
                    const customMatch = customModules.find((custom) => custom.id === module.id);
                    const isCustom = !!customMatch;
                    return (
                    <div
                      key={module.id}
                      className="group relative rounded-lg border bg-white p-3 transition-shadow hover:shadow-md"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-purple-100 to-blue-100">
                          <span className="text-xl">{module.icon}</span>
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <h4>{module.name}</h4>
                            {module.requiresVPN && (
                              <Badge variant="outline" className="text-xs">
                                需要VPN
                              </Badge>
                            )}
                            {isCustom && (
                              <Badge variant="secondary" className="ml-2 text-xs">
                                自定义
                              </Badge>
                            )}
                          </div>
                          <p className="text-gray-600">{module.description}</p>
                          <p className="text-gray-500">
                            预计耗时: {module.estimatedTime}秒
                          </p>
                          <p className="text-gray-400 text-sm line-clamp-2">
                            默认提示词: {module.promptTemplate}
                          </p>
                        </div>
                      </div>
                      <div className="mt-3 flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const source = customMatch ?? module;
                            setFormState({
                              id: source.id,
                              name: source.name,
                              category: source.category,
                              icon: source.icon,
                              description: source.description,
                              requiresVPN: source.requiresVPN,
                              estimatedTime: source.estimatedTime,
                              promptTemplate: source.promptTemplate,
                              supportedModels: source.supportedModels.join(', '),
                            });
                            setIsAddModalOpen(true);
                          }}
                        >
                          编辑
                        </Button>
                        <Button
                          size="sm"
                          className="w-full"
                          onClick={() => addStep(module)}
                        >
                          添加到编辑链
                          <ChevronRight className="ml-1 size-4" />
                        </Button>
                      </div>
                    </div>
                  );
                  })}
                </div>
              </div>
            )}

            {activeTab === 'projects' && (
              <div className="p-4">
                <p className="text-center text-gray-500">
                  暂无项目
                </p>
              </div>
            )}
          </ScrollArea>
        </div>

        {/* Model Selection */}
        <div className="border-t bg-white p-4">
          <p className="mb-2 text-gray-500">AI模型选择</p>
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="w-full rounded-lg border px-3 py-2"
          >
            {AI_MODELS.map(model => (
              <option key={model.name} value={model.name}>
                {model.name} ({model.region === 'domestic' ? '国内' : '国外'})
                {model.requiresVPN && ' 🔒'}
              </option>
            ))}
          </select>
          {activeModel && (
            <div className="mt-3 space-y-2 text-sm text-gray-600">
              <div className="flex items-center justify-between">
                <span>
                  地区: {activeModel.region === 'domestic' ? '国内' : '国外'} · 延迟约 {activeModel.latency}s
                </span>
                <span className="flex items-center gap-1 text-green-600">
                  <span className="size-2 rounded-full bg-green-500" />
                  在线
                </span>
              </div>

              <p>
                能力: {activeModel.capabilities.map((item) => item.replace(/_/g, ' ')).join(' / ')}
              </p>

              {activeModel.requiresVPN && (
                <div className="flex items-start gap-2 rounded-lg bg-red-50 p-2 text-red-600">
                  <ShieldAlert className="mt-0.5 size-4 shrink-0" />
                  <span>该模型位于海外，调用前请在设置中启用 VPN 代理。</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{isEditing ? '编辑自定义模块' : '新增自定义模块'}</DialogTitle>
            <DialogDescription>配置模块基础信息和默认提示词，供后续快速添加步骤。</DialogDescription>
          </DialogHeader>

          <form className="space-y-4" onSubmit={handleCreateModule}>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600">模块名称</label>
                <Input
                  value={formState.name}
                  onChange={(e) => setFormState((prev) => ({ ...prev, name: e.target.value }))}
                  maxLength={40}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600">分类</label>
                <select
                  value={formState.category}
                  onChange={(e) => setFormState((prev) => ({ ...prev, category: e.target.value as ModuleCategory }))}
                  className="w-full rounded-lg border px-3 py-2"
                >
                  <option value="creative">创意</option>
                  <option value="repair">修复</option>
                  <option value="enhancement">增强</option>
                  <option value="style">风格</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600">图标/Emoji</label>
                <Input
                  value={formState.icon}
                  onChange={(e) => setFormState((prev) => ({ ...prev, icon: e.target.value }))}
                  maxLength={2}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600">预计耗时(秒)</label>
                <Input
                  type="number"
                  min={1}
                  max={300}
                  value={formState.estimatedTime}
                  onChange={(e) => setFormState((prev) => ({ ...prev, estimatedTime: Number(e.target.value) }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600">模块描述</label>
              <Textarea
                value={formState.description}
                onChange={(e) => setFormState((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="模块用途说明，便于团队成员理解"
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600">默认提示词</label>
              <Textarea
                value={formState.promptTemplate}
                onChange={(e) => setFormState((prev) => ({ ...prev, promptTemplate: e.target.value }))}
                placeholder="请输入交付给 AI 模型的提示词，支持变量占位。"
                rows={4}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600">适用模型（逗号分隔）</label>
              <Input
                value={formState.supportedModels}
                onChange={(e) => setFormState((prev) => ({ ...prev, supportedModels: e.target.value }))}
                placeholder="例如：wenxin, gemini"
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border px-3 py-2">
              <div>
                <p className="text-sm font-medium text-gray-600">需要 VPN</p>
                <p className="text-xs text-gray-500">勾选后会标记模块使用海外模型，需要代理网络。</p>
              </div>
              <Switch
                checked={formState.requiresVPN}
                onCheckedChange={(checked) => setFormState((prev) => ({ ...prev, requiresVPN: checked }))}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>
                取消
              </Button>
              <Button type="submit">
                {isEditing ? '更新模块' : '保存模块'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </aside>
  );
}
