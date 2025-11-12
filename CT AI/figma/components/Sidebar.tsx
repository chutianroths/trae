import { useState } from 'react';
import { Folder, Boxes, FileText, History, Settings2, ChevronRight } from 'lucide-react';
import { EDIT_MODULES, AI_MODELS, ModuleCategory } from '../types';
import { useAppStore } from '../lib/store';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';

export function Sidebar() {
  const [activeTab, setActiveTab] = useState<'modules' | 'projects' | 'templates' | 'history'>('modules');
  const [selectedCategory, setSelectedCategory] = useState<ModuleCategory | 'all'>('all');
  const { addStep, selectedModel, setSelectedModel } = useAppStore();

  const categories = [
    { id: 'all' as const, label: '全部', count: EDIT_MODULES.length },
    { id: 'repair' as const, label: '修复', count: EDIT_MODULES.filter(m => m.category === 'repair').length },
    { id: 'enhancement' as const, label: '增强', count: EDIT_MODULES.filter(m => m.category === 'enhancement').length },
    { id: 'style' as const, label: '风格', count: EDIT_MODULES.filter(m => m.category === 'style').length },
    { id: 'creative' as const, label: '创意', count: EDIT_MODULES.filter(m => m.category === 'creative').length }
  ];

  const filteredModules = selectedCategory === 'all' 
    ? EDIT_MODULES 
    : EDIT_MODULES.filter(m => m.category === selectedCategory);

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

                {/* Modules List */}
                <div className="space-y-2">
                  <p className="mb-2 text-gray-500">可用模块</p>
                  {filteredModules.map(module => (
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
                          </div>
                          <p className="text-gray-600">{module.description}</p>
                          <p className="text-gray-500">
                            预计耗时: {module.estimatedTime}秒
                          </p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        className="mt-3 w-full"
                        onClick={() => addStep(module)}
                      >
                        添加到编辑链
                        <ChevronRight className="ml-1 size-4" />
                      </Button>
                    </div>
                  ))}
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
          <div className="mt-2 flex items-center justify-between text-gray-500">
            <span>延迟: {AI_MODELS.find(m => m.name === selectedModel)?.latency}s</span>
            <span className="flex items-center gap-1">
              <span className="size-2 rounded-full bg-green-500"></span>
              在线
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}