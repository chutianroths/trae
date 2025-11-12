import { useEffect, useMemo, useState } from 'react';
import { Wifi, WifiOff, Save, Clock, HardDrive, AlertTriangle } from 'lucide-react';
import { useAppStore } from '../lib/store';
import { Badge } from './ui/badge';
import { AI_MODELS } from '../types';

function formatRelativeTime(timestamp?: Date | string | null): string {
  if (!timestamp) return '未保存';
  const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
  if (Number.isNaN(date.getTime())) return '时间未知';

  const diffMs = Date.now() - date.getTime();
  if (diffMs < 0) return '刚刚';

  const diffMinutes = Math.floor(diffMs / 60000);
  if (diffMinutes < 1) {
    const diffSeconds = Math.floor(diffMs / 1000);
    return diffSeconds <= 5 ? '刚刚' : `${diffSeconds} 秒前`;
  }
  if (diffMinutes < 60) {
    return `${diffMinutes} 分钟前`;
  }
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) {
    return `${diffHours} 小时前`;
  }
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} 天前`;
}

export function StatusBar() {
  const { currentProject, vpnConfig, selectedModel } = useAppStore();
  const [isOnline, setIsOnline] = useState(
    typeof window !== 'undefined' ? window.navigator.onLine : true,
  );
  const [storageInfo, setStorageInfo] = useState<{ usage: number; quota: number } | null>(null);

  const modelInfo = useMemo(
    () => AI_MODELS.find((model) => model.name === selectedModel),
    [selectedModel],
  );
  const lastSaved = formatRelativeTime(currentProject?.updatedAt ?? null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    let mounted = true;

    async function fetchStorage() {
      if (typeof navigator === 'undefined') return;
      try {
        if (navigator.storage?.estimate) {
          const { usage = 0, quota = 0 } = await navigator.storage.estimate();
          if (mounted) setStorageInfo({ usage, quota });
          return;
        }

        if (typeof localStorage !== 'undefined') {
          const key = 'ct-ai-app-store';
          const value = localStorage.getItem(key) ?? '';
          const bytes = value.length * 2; // UTF-16
          if (mounted) setStorageInfo({ usage: bytes, quota: 10 * 1024 * 1024 * 1024 }); // assume 10GB
        }
      } catch {
        if (mounted) {
          setStorageInfo({ usage: 0, quota: 10 * 1024 * 1024 * 1024 });
        }
      }
    }

    fetchStorage();

    return () => {
      mounted = false;
    };
  }, [currentProject?.updatedAt]);

  const storageText = useMemo(() => {
    if (!storageInfo) return '存储: 计算中...';
    const usageGB = storageInfo.usage / (1024 ** 3);
    const quotaGB = storageInfo.quota / (1024 ** 3);
    return `存储: ${usageGB.toFixed(2)} GB / ${quotaGB.toFixed(2)} GB`;
  }, [storageInfo]);

  const vpnWarning =
    modelInfo?.requiresVPN && !vpnConfig.enabled
      ? '当前模型位于海外，请在设置中开启 VPN'
      : null;

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border-t bg-gray-50 px-6 py-2 text-sm text-gray-600">
      <div className="flex flex-wrap items-center gap-4">
        {/* Project Status */}
        <div className="flex items-center gap-2">
          <div className={`size-2 rounded-full ${currentProject ? 'bg-green-500' : 'bg-gray-400'}`} />
          <span>{currentProject ? '项目已加载' : '等待上传图片'}</span>
        </div>

        {/* Network Status */}
        <div className="flex items-center gap-2">
          {isOnline ? (
            <>
              <Wifi className="size-4" />
              <span>网络正常</span>
              {modelInfo?.latency && (
                <Badge variant="outline" className="ml-1">
                  延迟参考: {modelInfo.latency}s
                </Badge>
              )}
            </>
          ) : (
            <>
              <WifiOff className="size-4 text-red-500" />
              <span className="text-red-500">网络离线</span>
            </>
          )}
        </div>

        {/* VPN Status / Warning */}
        {vpnConfig.enabled && (
          <div className="flex items-center gap-2">
            <div className="size-2 rounded-full bg-blue-500" />
            <span>VPN 已启用</span>
          </div>
        )}
        {vpnWarning && (
          <div className="flex items-center gap-1 text-orange-600">
            <AlertTriangle className="size-4" />
            <span>{vpnWarning}</span>
          </div>
        )}

        {/* Save Status */}
        <div className="flex items-center gap-2">
          <Save className="size-4" />
          <span>最近保存</span>
          <span className="text-gray-500">({lastSaved})</span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        {/* Storage */}
        <div className="flex items-center gap-2">
          <HardDrive className="size-4" />
          <span>{storageText}</span>
        </div>

        {/* Model Info */}
        {modelInfo && (
          <div className="flex items-center gap-2">
            <Clock className="size-4" />
            <span>
              当前模型: {modelInfo.name}（{modelInfo.provider} ·{' '}
              {modelInfo.region === 'domestic' ? '国内' : '国外'}
              ）
            </span>
          </div>
        )}

        {/* Project Info */}
        {currentProject && (
          <Badge variant="secondary">{currentProject.name}</Badge>
        )}
      </div>
    </div>
  );
}
