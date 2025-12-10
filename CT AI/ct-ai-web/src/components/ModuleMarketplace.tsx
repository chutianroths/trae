import { useMemo, useState } from 'react';
import { Search, Download, Check } from 'lucide-react';
import { EDIT_MODULES } from '../types';
import type { ModuleCategory, EditModule } from '../types';
import { useAppStore } from '../lib/store';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { ScrollArea } from './ui/scroll-area';
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';

interface ModuleMarketplaceProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * 模块市场对话框组件
 * 用于浏览和添加可用的编辑模块
 */
export function ModuleMarketplace({ open, onOpenChange }: ModuleMarketplaceProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ModuleCategory | 'all'>('all');
  const { customModules, addCustomModule } = useAppStore();

  // 获取已安装的模块ID集合
  const installedModuleIds = useMemo(() => {
    return new Set(customModules.map((m) => m.id));
  }, [customModules]);

  // 合并所有可用模块
  const allModules = useMemo(() => {
    const map = new Map<string, EditModule>();
    EDIT_MODULES.forEach((module) => map.set(module.id, module));
    customModules.forEach((module) => map.set(module.id, module));
    return Array.from(map.values());
  }, [customModules]);

  // 过滤模块
  const filteredModules = useMemo(() => {
    let filtered = allModules;

    // 按分类过滤
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((m) => m.category === selectedCategory);
    }

    // 按搜索关键词过滤
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (m) =>
          m.name.toLowerCase().includes(query) ||
          m.description.toLowerCase().includes(query) ||
          m.id.toLowerCase().includes(query),
      );
    }

    return filtered;
  }, [allModules, selectedCategory, searchQuery]);

  // 分类统计
  const categoryCounts = useMemo(
    () => ({
      all: allModules.length,
      repair: allModules.filter((m) => m.category === 'repair').length,
      enhancement: allModules.filter((m) => m.category === 'enhancement').length,
      style: allModules.filter((m) => m.category === 'style').length,
      creative: allModules.filter((m) => m.category === 'creative').length,
    }),
    [allModules],
  );

  /**
   * 处理模块添加
   * @param module - 要添加的模块
   */
  const handleAddModule = (module: EditModule) => {
    // 检查是否已安装
    if (installedModuleIds.has(module.id)) {
      return;
    }

    // 添加到自定义模块
    addCustomModule({
      id: module.id,
      name: module.name,
      category: module.category,
      icon: module.icon,
      description: module.description,
      requiresVPN: module.requiresVPN,
      estimatedTime: module.estimatedTime,
      supportedModels: module.supportedModels,
      promptTemplate: module.promptTemplate,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh]">
        <DialogHeader>
          <DialogTitle>模块市场</DialogTitle>
          <DialogDescription>
            浏览和添加可用的图像编辑模块，扩展你的工作流程
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* 搜索栏 */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
            <Input
              placeholder="搜索模块名称、描述或ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          <Tabs value={selectedCategory} onValueChange={(value) => setSelectedCategory(value as ModuleCategory | 'all')} className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">
                全部 ({categoryCounts.all})
              </TabsTrigger>
              <TabsTrigger value="repair">
                修复 ({categoryCounts.repair})
              </TabsTrigger>
              <TabsTrigger value="enhancement">
                增强 ({categoryCounts.enhancement})
              </TabsTrigger>
              <TabsTrigger value="style">
                风格 ({categoryCounts.style})
              </TabsTrigger>
              <TabsTrigger value="creative">
                创意 ({categoryCounts.creative})
              </TabsTrigger>
            </TabsList>

            <div className="mt-4">
              <ScrollArea className="h-[50vh] pr-4">
                {filteredModules.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                    <Search className="size-12 mb-4 opacity-50" />
                    <p className="text-lg font-medium">未找到匹配的模块</p>
                    <p className="text-sm">尝试调整搜索条件或分类筛选</p>
                  </div>
                ) : (
                  <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                    {filteredModules.map((module) => {
                      const isInstalled = installedModuleIds.has(module.id);
                      const isCustom = customModules.some((m) => m.id === module.id);

                      return (
                        <Card key={module.id} className="p-4 space-y-3">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3">
                              <span className="text-2xl">{module.icon}</span>
                              <div className="flex-1">
                                <h3 className="font-semibold text-lg">{module.name}</h3>
                                <p className="text-sm text-gray-600 mt-1">
                                  {module.description}
                                </p>
                              </div>
                            </div>
                            <Badge
                              variant={
                                module.category === 'repair'
                                  ? 'destructive'
                                  : module.category === 'enhancement'
                                    ? 'default'
                                    : module.category === 'style'
                                      ? 'secondary'
                                      : 'outline'
                              }
                              className="ml-2"
                            >
                              {module.category === 'repair'
                                ? '修复'
                                : module.category === 'enhancement'
                                  ? '增强'
                                  : module.category === 'style'
                                    ? '风格'
                                    : '创意'}
                            </Badge>
                          </div>

                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <span>预计耗时: {module.estimatedTime}秒</span>
                            {module.requiresVPN && (
                              <Badge variant="outline" className="text-xs">
                                🔒 需VPN
                              </Badge>
                            )}
                            {isCustom && (
                              <Badge variant="outline" className="text-xs">
                                自定义
                              </Badge>
                            )}
                          </div>

                          {module.promptTemplate && (
                            <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                              <strong>默认提示词:</strong> {module.promptTemplate}
                            </div>
                          )}

                          <div className="flex items-center gap-2">
                            {isInstalled ? (
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex-1"
                                disabled
                              >
                                <Check className="size-4 mr-2" />
                                已添加
                              </Button>
                            ) : (
                              <Button
                                variant="default"
                                size="sm"
                                className="flex-1"
                                onClick={() => handleAddModule(module)}
                              >
                                <Download className="size-4 mr-2" />
                                添加到侧边栏
                              </Button>
                            )}
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </ScrollArea>
            </div>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
