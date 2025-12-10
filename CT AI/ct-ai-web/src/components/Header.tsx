import { useState } from 'react';
import { ImagePlus, Settings, User, FileCode, File, FolderOpen, Save, Download, X, Undo, Redo, Copy, Clipboard, Trash2, BookOpen, FileQuestion, Info, RefreshCw, Clock } from 'lucide-react';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Input } from './ui/input';
import { ModuleMarketplace } from './ModuleMarketplace';
import { useAppStore } from '../lib/store';
import { EDIT_MODULES } from '../types';
import { Card } from './ui/card';

export function Header({ onOpenSettings }: { onOpenSettings?: () => void }) {
  const [isMarketplaceOpen, setIsMarketplaceOpen] = useState(false);
  const [isOpenProjectDialogOpen, setIsOpenProjectDialogOpen] = useState(false);
  const [isNewProjectDialogOpen, setIsNewProjectDialogOpen] = useState(false);
  const [isSaveAsDialogOpen, setIsSaveAsDialogOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [saveAsProjectName, setSaveAsProjectName] = useState('');
  const { currentProject, createProject, updateProject, projects, loadProject } = useAppStore();

  /**
   * 处理新建项目对话框打开
   */
  const handleNewProjectClick = () => {
    setNewProjectName('');
    setIsNewProjectDialogOpen(true);
  };

  /**
   * 处理确认创建项目
   */
  const handleConfirmNewProject = () => {
    const name = newProjectName.trim();
    if (name) {
      createProject(name);
      setIsNewProjectDialogOpen(false);
      setNewProjectName('');
    }
  };

  /**
   * 处理打开项目对话框
   */
  const handleOpenProjectClick = () => {
    if (projects.length === 0) {
      alert('暂无可用项目，请先创建项目');
      return;
    }
    setIsOpenProjectDialogOpen(true);
  };

  /**
   * 处理选择并打开项目
   */
  const handleSelectProject = (projectId: string) => {
    loadProject(projectId);
    setIsOpenProjectDialogOpen(false);
  };

  /**
   * 处理保存项目
   */
  const handleSave = () => {
    if (currentProject) {
      updateProject({});
      alert('项目已保存');
    } else {
      alert('没有可保存的项目');
    }
  };

  /**
   * 处理另存为对话框打开
   */
  const handleSaveAsClick = () => {
    if (!currentProject) {
      alert('没有可保存的项目');
      return;
    }
    setSaveAsProjectName(currentProject.name);
    setIsSaveAsDialogOpen(true);
  };

  /**
   * 处理确认另存为
   */
  const handleConfirmSaveAs = () => {
    if (!currentProject) return;
    
    const name = saveAsProjectName.trim();
    if (name && name !== currentProject.name) {
      createProject(name);
      // 复制当前项目的步骤到新项目
      const newProject = useAppStore.getState().currentProject;
      if (newProject) {
        updateProject({
          steps: currentProject.steps,
          originalImage: currentProject.originalImage,
          resultImage: currentProject.resultImage,
        });
      }
      setIsSaveAsDialogOpen(false);
      setSaveAsProjectName('');
      alert('项目已另存为');
    }
  };

  /**
   * 处理导出结果
   */
  const handleExport = () => {
    if (!currentProject?.resultImage) {
      alert('没有可导出的结果图像');
      return;
    }
    const link = document.createElement('a');
    link.href = currentProject.resultImage;
    link.download = `ct-ai-${currentProject.name}-${Date.now()}.png`;
    link.click();
  };

  /**
   * 处理添加模块到编辑链
   */
  const handleAddModule = (moduleId: string) => {
    const module = EDIT_MODULES.find(m => m.id === moduleId);
    if (module) {
      const { addStep } = useAppStore.getState();
      addStep(module);
    }
  };

  return (
    <header className="border-b bg-white px-6 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-blue-600">
              <ImagePlus className="size-5 text-white" />
            </div>
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              CT AI
            </span>
          </div>
          
          <nav className="flex items-center gap-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">文件</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem onClick={handleNewProjectClick}>
                  <File className="mr-2 size-4" />
                  新建项目
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleOpenProjectClick}>
                  <FolderOpen className="mr-2 size-4" />
                  打开项目
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSave} disabled={!currentProject}>
                  <Save className="mr-2 size-4" />
                  保存
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSaveAsClick} disabled={!currentProject}>
                  <Save className="mr-2 size-4" />
                  另存为
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleExport} disabled={!currentProject?.resultImage}>
                  <Download className="mr-2 size-4" />
                  导出结果
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => window.close()}>
                  <X className="mr-2 size-4" />
                  退出
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">编辑</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem onClick={() => alert('撤销功能开发中...')}>
                  <Undo className="mr-2 size-4" />
                  撤销
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => alert('重做功能开发中...')}>
                  <Redo className="mr-2 size-4" />
                  重做
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => {
                  const selectedStep = currentProject?.steps[currentProject.steps.length - 1];
                  if (selectedStep) {
                    navigator.clipboard.writeText(JSON.stringify(selectedStep, null, 2));
                    alert('步骤已复制到剪贴板');
                  } else {
                    alert('请先选择要复制的步骤');
                  }
                }} disabled={!currentProject || currentProject.steps.length === 0}>
                  <Copy className="mr-2 size-4" />
                  复制步骤
                </DropdownMenuItem>
                <DropdownMenuItem onClick={async () => {
                  try {
                    const text = await navigator.clipboard.readText();
                    const step = JSON.parse(text);
                    if (step.moduleId && step.moduleName) {
                      const { addStep } = useAppStore.getState();
                      const module = EDIT_MODULES.find(m => m.id === step.moduleId);
                      if (module) {
                        addStep(module);
                        alert('步骤已粘贴');
                      } else {
                        alert('无法找到对应的模块');
                      }
                    } else {
                      alert('剪贴板内容不是有效的步骤数据');
                    }
                  } catch {
                    alert('无法读取剪贴板内容');
                  }
                }} disabled={!currentProject}>
                  <Clipboard className="mr-2 size-4" />
                  粘贴步骤
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => {
                  if (currentProject?.steps.length) {
                    const { removeStep } = useAppStore.getState();
                    const lastStep = currentProject.steps[currentProject.steps.length - 1];
                    if (confirm('确定要删除最后一个步骤吗？')) {
                      removeStep(lastStep.id);
                    }
                  } else {
                    alert('没有可删除的步骤');
                  }
                }} disabled={!currentProject || currentProject.steps.length === 0}>
                  <Trash2 className="mr-2 size-4" />
                  删除步骤
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">模块</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem onClick={() => handleAddModule('line-art-colorization')}>
                  🎨 线稿上色
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleAddModule('person-removal')}>
                  👤 人物消除
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleAddModule('auto-lighting')}>
                  💡 自动打光
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleAddModule('background-replacement')}>
                  🏞️ 背景替换
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleAddModule('style-transfer')}>
                  🎭 风格转换
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleAddModule('quality-enhancement')}>
                  ✨ 画质增强
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleAddModule('old-photo-restoration')}>
                  📷 老照片修复
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleAddModule('portrait-beautification')}>
                  💄 人像美化
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleAddModule('creative-generation')}>
                  🚀 创意生成
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleAddModule('effects-composition')}>
                  🎬 特效合成
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">帮助</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem onClick={() => alert('使用教程功能开发中...')}>
                  <BookOpen className="mr-2 size-4" />
                  使用教程
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => window.open('https://github.com/your-repo/docs', '_blank')}>
                  <FileQuestion className="mr-2 size-4" />
                  API文档
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => {
                  fetch('https://api.github.com/repos/your-repo/ct-ai/releases/latest')
                    .then(res => res.json())
                    .then(data => {
                      alert(`最新版本: ${data.tag_name}\n${data.body?.substring(0, 200)}`);
                    })
                    .catch(() => alert('检查更新失败，请稍后重试'));
                }}>
                  <RefreshCw className="mr-2 size-4" />
                  检查更新
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => {
                  alert('CT AI v1.0.0\n\n智能图像链式编辑应用\n支持多AI模型集成与模块化编辑流程');
                }}>
                  <Info className="mr-2 size-4" />
                  关于 CT AI
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setIsMarketplaceOpen(true)}>
            <FileCode className="size-4" />
            模块市场
          </Button>
          <Button variant="ghost" size="icon" onClick={onOpenSettings}>
            <Settings className="size-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => alert('用户中心功能开发中...')}>
            <User className="size-4" />
          </Button>
        </div>
      </div>

      <ModuleMarketplace open={isMarketplaceOpen} onOpenChange={setIsMarketplaceOpen} />

      {/* 新建项目对话框 */}
      <Dialog open={isNewProjectDialogOpen} onOpenChange={setIsNewProjectDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>新建项目</DialogTitle>
            <DialogDescription>
              请输入项目名称以创建新项目。
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <Input
              placeholder="项目名称"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && newProjectName.trim()) {
                  handleConfirmNewProject();
                }
              }}
              autoFocus
            />
            
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsNewProjectDialogOpen(false);
                  setNewProjectName('');
                }}
              >
                取消
              </Button>
              <Button
                onClick={handleConfirmNewProject}
                disabled={!newProjectName.trim()}
              >
                创建
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* 另存为对话框 */}
      <Dialog open={isSaveAsDialogOpen} onOpenChange={setIsSaveAsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>另存为</DialogTitle>
            <DialogDescription>
              请输入新项目名称以保存当前项目的副本。
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <Input
              placeholder="项目名称"
              value={saveAsProjectName}
              onChange={(e) => setSaveAsProjectName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && saveAsProjectName.trim() && saveAsProjectName.trim() !== currentProject?.name) {
                  handleConfirmSaveAs();
                }
              }}
              autoFocus
            />
            
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsSaveAsDialogOpen(false);
                  setSaveAsProjectName('');
                }}
              >
                取消
              </Button>
              <Button
                onClick={handleConfirmSaveAs}
                disabled={!saveAsProjectName.trim() || saveAsProjectName.trim() === currentProject?.name}
              >
                保存
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* 打开项目对话框 */}
      <Dialog open={isOpenProjectDialogOpen} onOpenChange={setIsOpenProjectDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>打开项目</DialogTitle>
            <DialogDescription>
              选择一个项目以继续编辑。当前已保存 {projects.length} 个项目。
            </DialogDescription>
          </DialogHeader>
          
          <div className="max-h-[60vh] overflow-y-auto space-y-2 py-4">
            {projects.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <FolderOpen className="mx-auto size-12 mb-4 opacity-50" />
                <p>暂无可用项目</p>
                <p className="text-sm mt-2">请先创建一个新项目</p>
              </div>
            ) : (
              projects.map((project) => (
                <Card
                  key={project.id}
                  className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                    currentProject?.id === project.id
                      ? 'ring-2 ring-purple-600 bg-purple-50'
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => handleSelectProject(project.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">{project.name}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                        <span className="flex items-center gap-1">
                          <File className="size-4" />
                          {project.steps.length} 个步骤
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="size-4" />
                          更新于 {new Date(project.updatedAt).toLocaleString('zh-CN')}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {project.originalImage && (
                          <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded">
                            已上传图片
                          </span>
                        )}
                        {project.resultImage && (
                          <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                            已生成结果
                          </span>
                        )}
                        <span
                          className={`text-xs px-2 py-1 rounded ${
                            project.status === 'completed'
                              ? 'bg-green-100 text-green-700'
                              : project.status === 'processing'
                                ? 'bg-yellow-100 text-yellow-700'
                                : project.status === 'error'
                                  ? 'bg-red-100 text-red-700'
                                  : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {project.status === 'draft' && '草稿'}
                          {project.status === 'processing' && '处理中'}
                          {project.status === 'completed' && '已完成'}
                          {project.status === 'error' && '错误'}
                        </span>
                      </div>
                    </div>
                    {currentProject?.id === project.id && (
                      <span className="ml-4 text-purple-600 font-medium">当前项目</span>
                    )}
                  </div>
                </Card>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </header>
  );
}
