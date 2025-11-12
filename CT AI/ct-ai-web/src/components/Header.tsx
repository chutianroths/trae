import { ImagePlus, Settings, User, FileCode, File, FolderOpen, Save, Download, X, Undo, Redo, Copy, Clipboard, Trash2, BookOpen, FileQuestion, Info, RefreshCw } from 'lucide-react';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

export function Header({ onOpenSettings }: { onOpenSettings?: () => void }) {
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
                <DropdownMenuItem>
                  <File className="mr-2 size-4" />
                  新建项目
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <FolderOpen className="mr-2 size-4" />
                  打开项目
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Save className="mr-2 size-4" />
                  保存
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Save className="mr-2 size-4" />
                  另存为
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Download className="mr-2 size-4" />
                  导出结果
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
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
                <DropdownMenuItem>
                  <Undo className="mr-2 size-4" />
                  撤销
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Redo className="mr-2 size-4" />
                  重做
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Copy className="mr-2 size-4" />
                  复制步骤
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Clipboard className="mr-2 size-4" />
                  粘贴步骤
                </DropdownMenuItem>
                <DropdownMenuItem>
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
                <DropdownMenuItem>🎨 线稿上色</DropdownMenuItem>
                <DropdownMenuItem>👤 人物消除</DropdownMenuItem>
                <DropdownMenuItem>💡 自动打光</DropdownMenuItem>
                <DropdownMenuItem>🏞️ 背景替换</DropdownMenuItem>
                <DropdownMenuItem>🎭 风格转换</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>✨ 画质增强</DropdownMenuItem>
                <DropdownMenuItem>📷 老照片修复</DropdownMenuItem>
                <DropdownMenuItem>💄 人像美化</DropdownMenuItem>
                <DropdownMenuItem>🚀 创意生成</DropdownMenuItem>
                <DropdownMenuItem>🎬 特效合成</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">帮助</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem>
                  <BookOpen className="mr-2 size-4" />
                  使用教程
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <FileQuestion className="mr-2 size-4" />
                  API文档
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <RefreshCw className="mr-2 size-4" />
                  检查更新
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Info className="mr-2 size-4" />
                  关于 CT AI
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <FileCode className="size-4" />
            模块市场
          </Button>
          <Button variant="ghost" size="icon" onClick={onOpenSettings}>
            <Settings className="size-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <User className="size-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
