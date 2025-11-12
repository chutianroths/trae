import { useState } from 'react';
import { Plus, FileText, Upload } from 'lucide-react';
import { useAppStore } from '../lib/store';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

export function WelcomeDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [projectName, setProjectName] = useState('');
  const { createProject } = useAppStore();

  const handleCreateProject = () => {
    if (projectName.trim()) {
      createProject(projectName);
      onOpenChange(false);
      setProjectName('');
    }
  };

  const handleTemplateStart = () => {
    // 创建一个带有示例编辑链的项目
    createProject('模板项目 - ' + new Date().toLocaleString('zh-CN'));
    onOpenChange(false);
  };

  const handleUploadAndEdit = () => {
    // 触发文件上传
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        createProject('图片编辑 - ' + file.name);
        onOpenChange(false);
      }
    };
    input.click();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>欢迎使用 CT AI</DialogTitle>
          <DialogDescription>
            智能图像链式编辑应用 - 让复杂的图像编辑变得简单
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Create New Project */}
          <div className="space-y-3">
            <h3>创建新项目</h3>
            <div className="grid gap-3">
              <div className="space-y-2">
                <Label htmlFor="project-name">项目名称</Label>
                <Input
                  id="project-name"
                  placeholder="例如: 人像美化处理"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCreateProject()}
                />
              </div>
              <Button onClick={handleCreateProject} disabled={!projectName.trim()}>
                <Plus className="size-4" />
                创建项目
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-2 text-gray-500">或</span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid gap-3 sm:grid-cols-2">
            <Button variant="outline" className="h-auto flex-col gap-2 py-6" onClick={handleTemplateStart}>
              <FileText className="size-8" />
              <div className="space-y-1 text-center">
                <p>从模板开始</p>
                <p className="text-gray-500">选择预设编辑流程</p>
              </div>
            </Button>
            <Button variant="outline" className="h-auto flex-col gap-2 py-6" onClick={handleUploadAndEdit}>
              <Upload className="size-8" />
              <div className="space-y-1 text-center">
                <p>上传并编辑</p>
                <p className="text-gray-500">直接开始处理图片</p>
              </div>
            </Button>
          </div>

          {/* Features Overview */}
          <div className="rounded-lg border bg-gradient-to-br from-purple-50 to-blue-50 p-4">
            <h4 className="mb-3">核心功能</h4>
            <div className="grid gap-2 sm:grid-cols-2">
              <div className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <p className="text-gray-700">10+ 智能编辑模块</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <p className="text-gray-700">可视化链式编辑</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <p className="text-gray-700">多AI模型支持</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <p className="text-gray-700">实时处理进度</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
