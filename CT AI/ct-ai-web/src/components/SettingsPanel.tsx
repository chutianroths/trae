import { useMemo } from 'react';
import { Shield, Image as ImageIcon, Key } from 'lucide-react';
import { useAppStore } from '../lib/store';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Slider } from './ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Card } from './ui/card';
import { AI_MODELS } from '../types';
import { ScrollArea } from './ui/scroll-area';

export function SettingsPanel({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const {
    vpnConfig,
    compressionConfig,
    apiKeys,
    updateVPNConfig,
    updateCompressionConfig,
    setApiKey,
  } = useAppStore();
  const modelKeyInputs = useMemo(() => {
    const seen = new Set<string>();
    return AI_MODELS.filter((model) => {
      if (seen.has(model.apiKeyId)) {
        return false;
      }
      seen.add(model.apiKeyId);
      return true;
    });
  }, []);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh]">
        <DialogHeader>
          <DialogTitle>设置</DialogTitle>
          <DialogDescription>
            配置应用程序的功能和性能选项
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh] pr-2">
        <Tabs defaultValue="compression" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="compression">
              <ImageIcon className="mr-2 size-4" />
              图片压缩
            </TabsTrigger>
            <TabsTrigger value="vpn">
              <Shield className="mr-2 size-4" />
              VPN代理
            </TabsTrigger>
            <TabsTrigger value="api">
              <Key className="mr-2 size-4" />
              API密钥
            </TabsTrigger>
          </TabsList>

          <TabsContent value="compression" className="space-y-4">
            <Card className="p-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="compression-enabled">启用图片压缩</Label>
                    <p className="text-gray-600">
                      自动压缩上传的图片以加快处理速度
                    </p>
                  </div>
                  <Switch
                    id="compression-enabled"
                    checked={compressionConfig.enabled}
                    onCheckedChange={(enabled) => updateCompressionConfig({ enabled })}
                  />
                </div>

                {compressionConfig.enabled && (
                  <>
                    <div className="space-y-2">
                      <Label>图片质量: {compressionConfig.quality}%</Label>
                      <Slider
                        value={[compressionConfig.quality]}
                        onValueChange={([quality]) => updateCompressionConfig({ quality })}
                        min={50}
                        max={100}
                        step={5}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>最大文件大小: {compressionConfig.maxFileSize} MB</Label>
                      <Slider
                        value={[compressionConfig.maxFileSize]}
                        onValueChange={([maxFileSize]) => updateCompressionConfig({ maxFileSize })}
                        min={1}
                        max={20}
                        step={1}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="resize-enabled">启用尺寸调整</Label>
                        <p className="text-gray-600">
                          限制图片的最大宽度和高度
                        </p>
                      </div>
                      <Switch
                        id="resize-enabled"
                        checked={compressionConfig.resize.enabled}
                        onCheckedChange={(enabled) =>
                          updateCompressionConfig({
                            resize: { ...compressionConfig.resize, enabled }
                          })
                        }
                      />
                    </div>
                  </>
                )}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="vpn" className="space-y-4">
            <Card className="p-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="vpn-enabled">启用VPN代理</Label>
                    <p className="text-gray-600">
                      为国外AI模型使用代理连接
                    </p>
                  </div>
                  <Switch
                    id="vpn-enabled"
                    checked={vpnConfig.enabled}
                    onCheckedChange={(enabled) => updateVPNConfig({ enabled })}
                  />
                </div>

                {vpnConfig.enabled && (
                  <>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="auto-switch">自动切换</Label>
                        <p className="text-gray-600">
                          根据模型区域自动启用/禁用代理
                        </p>
                      </div>
                      <Switch
                        id="auto-switch"
                        checked={vpnConfig.autoSwitch}
                        onCheckedChange={(autoSwitch) => updateVPNConfig({ autoSwitch })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>代理类型</Label>
                      <select
                        value={vpnConfig.proxyType}
                        onChange={(e) =>
                          updateVPNConfig({ proxyType: e.target.value as typeof vpnConfig.proxyType })
                        }
                        className="w-full rounded-lg border px-3 py-2"
                      >
                        <option value="system">系统代理</option>
                        <option value="manual">手动配置</option>
                        <option value="pac">PAC脚本</option>
                      </select>
                    </div>

                    <div className="rounded-lg bg-blue-50 p-3 text-sm text-blue-800">
                      <p>
                        提示：使用 Gemini、DALL·E、Stable Diffusion、Midjourney、Adobe Firefly 等国外模型时，请确保代理可访问对应服务域名。
                      </p>
                    </div>
                  </>
                )}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="api" className="space-y-4">
            <Card className="p-4">
              <div className="space-y-4">
                <p className="text-gray-600">
                  配置各AI服务商的API密钥。密钥将加密存储在本地。
                </p>

                <ScrollArea className="max-h-[48vh] pr-2">
                <div className="space-y-4 pb-2">
                  {modelKeyInputs.map((model) => {
                    const inputId = `${model.apiKeyId}-key`;
                    return (
                      <div
                        className="space-y-3 rounded-lg border border-gray-200 bg-white p-3 shadow-sm"
                        key={model.apiKeyId}
                      >
                        <div className="space-y-1">
                          <Label className="text-sm font-semibold text-gray-700" htmlFor={inputId}>
                            {model.name} API Key
                          </Label>
                          <p className="text-xs text-gray-500">
                            供应商: {model.provider} · {model.region === 'domestic' ? '国内服务' : '国外服务'}
                            {model.requiresVPN ? '（需VPN）' : ''}
                          </p>
                        </div>
                        <input
                          id={inputId}
                          type="password"
                          placeholder="sk-..."
                          className="w-full rounded-lg border px-3 py-2"
                          value={apiKeys[model.apiKeyId]}
                          autoComplete="off"
                          onChange={(event) => setApiKey(model.apiKeyId, event.target.value)}
                        />
                        <p className="text-xs text-gray-400">
                          能力范围: {model.capabilities.map((item) => item.replace(/_/g, ' ')).join(' / ')}
                        </p>
                      </div>
                    );
                  })}
                </div>
                </ScrollArea>

                <div className="rounded-lg bg-blue-50 p-3">
                  <p className="text-blue-800">
                    💡 提示: API密钥将只存储在您的浏览器本地并立即生效，不会上传到任何服务器
                  </p>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
