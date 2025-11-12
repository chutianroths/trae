import { useState } from 'react';
import { Play, Pause, SkipForward, Trash2, Copy, Settings, AlertCircle, CheckCircle2, Loader2, Clock } from 'lucide-react';
import { useAppStore } from '../lib/store';
import { STATUS_CONFIG } from '../types';
import type { EditStep } from '../types';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Textarea } from './ui/textarea';

function StatusIndicator({ status, progress }: { status: EditStep['status']; progress?: number }) {
  const config = STATUS_CONFIG[status];
  
  return (
    <div className="flex items-center gap-2">
      <div 
        className="flex size-8 items-center justify-center rounded-full"
        style={{ backgroundColor: `${config.color}20` }}
      >
        {status === 'processing' ? (
          <Loader2 className="size-4 animate-spin" style={{ color: config.color }} />
        ) : status === 'success' ? (
          <CheckCircle2 className="size-4" style={{ color: config.color }} />
        ) : status === 'error' ? (
          <AlertCircle className="size-4" style={{ color: config.color }} />
        ) : (
          <Clock className="size-4" style={{ color: config.color }} />
        )}
      </div>
      <div>
        <p style={{ color: config.color }}>{config.label}</p>
        {status === 'processing' && progress !== undefined && (
          <p className="text-gray-500">进度: {progress}%</p>
        )}
      </div>
    </div>
  );
}

export function ChainEditor() {
  const [stepInEditing, setStepInEditing] = useState<EditStep | null>(null);
  const {
    currentProject,
    removeStep,
    executeStep,
    executeAllSteps,
    updateStepStatus,
    duplicateStep,
    skipStep,
  } = useAppStore();

  if (!currentProject) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center text-gray-500">
          <p className="mb-2">创建或选择一个项目开始</p>
        </div>
      </div>
    );
  }

  const handleExecuteStep = async (stepId: string) => {
    await executeStep(stepId);
  };

  const handleExecuteAll = async () => {
    await executeAllSteps();
  };

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b bg-white px-6 py-4">
        <div>
          <h2>链式编辑器</h2>
          <p className="text-gray-600">
            {currentProject.name} - {currentProject.steps.length} 个步骤
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleExecuteAll}
            disabled={currentProject.steps.length === 0 || currentProject.status === 'processing'}
          >
            {currentProject.status === 'processing' ? (
              <>
                <Pause className="size-4" />
                暂停链
              </>
            ) : (
              <>
                <Play className="size-4" />
                执行全部
              </>
            )}
          </Button>
          <Button variant="outline">
            保存进度
          </Button>
        </div>
      </div>

      {/* Steps List */}
      <div className="flex-1 overflow-y-auto bg-gray-50 p-6">
        {currentProject.steps.length === 0 ? (
          <Alert>
            <AlertDescription>
              从左侧边栏选择编辑模块，开始构建你的图像处理流程
            </AlertDescription>
          </Alert>
        ) : (
          <div className="mx-auto max-w-4xl space-y-4">
            {currentProject.steps.map((step, index) => (
              <div key={step.id}>
                <Card className="overflow-hidden bg-white">
                  <div className="p-4">
                    <div className="flex items-start gap-4">
                      {/* Step Number */}
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-blue-600">
                        <span className="text-white">{index + 1}</span>
                      </div>

                      {/* Step Info */}
                      <div className="flex-1">
                        <div className="mb-3 flex items-start justify-between">
                          <div>
                            <h3 className="mb-1">步骤 {index + 1}: {step.moduleName}</h3>
                            <p className="text-gray-600">
                              模块ID: {step.moduleId}
                            </p>
                          </div>
                          
                          <StatusIndicator status={step.status} progress={step.progress} />
                        </div>

                        {/* Progress Bar */}
                        {step.status === 'processing' && step.progress !== undefined && (
                          <Progress value={step.progress} className="mb-3" />
                        )}

                        {/* Processing Time */}
                        {step.processingTime && (
                          <p className="mb-2 text-gray-600">
                            处理时间: {step.processingTime.toFixed(1)}秒
                          </p>
                        )}

                        {/* Error Message */}
                        {step.status === 'error' && step.errorMessage && (
                          <Alert variant="destructive" className="mb-3">
                            <AlertCircle className="size-4" />
                            <AlertDescription>{step.errorMessage}</AlertDescription>
                          </Alert>
                        )}

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          {step.status === 'pending' || step.status === 'error' ? (
                            <Button
                              size="sm"
                              onClick={() => handleExecuteStep(step.id)}
                            >
                              <Play className="size-4" />
                              执行此步骤
                            </Button>
                          ) : step.status === 'success' ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                updateStepStatus(step.id, 'pending');
                              }}
                            >
                              重新执行
                            </Button>
                          ) : null}
                          
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setStepInEditing(step)}
                          >
                            <Settings className="size-4" />
                            配置
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => duplicateStep(step.id)}
                          >
                            <Copy className="size-4" />
                            复制
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => skipStep(step.id)}
                          >
                            <SkipForward className="size-4" />
                            跳过
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => removeStep(step.id)}
                          >
                            <Trash2 className="size-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Arrow Between Steps */}
                {index < currentProject.steps.length - 1 && (
                  <div className="flex justify-center py-2">
                    <div className="flex size-8 items-center justify-center rounded-full bg-gray-200">
                      <span className="text-gray-600">↓</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={!!stepInEditing} onOpenChange={(open) => !open && setStepInEditing(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>模块配置</DialogTitle>
            <DialogDescription>
              {stepInEditing
                ? `步骤「${stepInEditing.moduleName}」的参数和执行信息`
                : '未选择步骤'}
            </DialogDescription>
          </DialogHeader>

          {stepInEditing && (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">模块 ID</p>
                <p className="font-medium">{stepInEditing.moduleId}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">当前状态</p>
                <p className="font-medium">{STATUS_CONFIG[stepInEditing.status].label}</p>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-gray-500">参数（JSON）</p>
                <Textarea
                  value={JSON.stringify(stepInEditing.parameters ?? {}, null, 2)}
                  readOnly
                  className="h-40 resize-none font-mono text-sm"
                />
                <p className="text-xs text-gray-500">
                  功能预留：后续可在此处编辑参数并保存。
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setStepInEditing(null)}>
              关闭
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Footer Stats */}
      <div className="border-t bg-white px-6 py-3">
        <div className="flex items-center justify-between text-gray-600">
          <div className="flex items-center gap-6">
            <span>
              总步骤: {currentProject.steps.length}
            </span>
            <span>
              已完成: {currentProject.steps.filter(s => s.status === 'success').length}
            </span>
            <span>
              处理中: {currentProject.steps.filter(s => s.status === 'processing').length}
            </span>
            <span>
              失败: {currentProject.steps.filter(s => s.status === 'error').length}
            </span>
          </div>
          
          <Badge variant={
            currentProject.status === 'completed' ? 'default' :
            currentProject.status === 'processing' ? 'secondary' :
            currentProject.status === 'error' ? 'destructive' :
            'outline'
          }>
            {currentProject.status === 'draft' && '草稿'}
            {currentProject.status === 'processing' && '处理中'}
            {currentProject.status === 'completed' && '已完成'}
            {currentProject.status === 'error' && '错误'}
          </Badge>
        </div>
      </div>
    </div>
  );
}
