import { Wifi, WifiOff, Save, Clock, HardDrive } from 'lucide-react';
import { useAppStore } from '../lib/store';
import { Badge } from './ui/badge';

export function StatusBar() {
  const { currentProject, vpnConfig } = useAppStore();
  const networkStatus = 'good'; // Mock network status
  const lastSaved = '2分钟前';

  return (
    <div className="flex items-center justify-between border-t bg-gray-50 px-6 py-2 text-gray-600">
      <div className="flex items-center gap-4">
        {/* Project Status */}
        <div className="flex items-center gap-2">
          <div className="size-2 rounded-full bg-green-500"></div>
          <span>就绪</span>
        </div>

        {/* Network Status */}
        <div className="flex items-center gap-2">
          {networkStatus === 'good' ? (
            <>
              <Wifi className="size-4" />
              <span>网络良好</span>
              <Badge variant="outline" className="ml-1">
                延迟: 1.2s
              </Badge>
            </>
          ) : (
            <>
              <WifiOff className="size-4 text-red-500" />
              <span className="text-red-500">网络异常</span>
            </>
          )}
        </div>

        {/* VPN Status */}
        {vpnConfig.enabled && (
          <div className="flex items-center gap-2">
            <div className="size-2 rounded-full bg-blue-500"></div>
            <span>VPN已启用</span>
          </div>
        )}

        {/* Save Status */}
        <div className="flex items-center gap-2">
          <Save className="size-4" />
          <span>已保存</span>
          <span className="text-gray-500">({lastSaved})</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Storage */}
        <div className="flex items-center gap-2">
          <HardDrive className="size-4" />
          <span>存储: 2.4 GB / 10 GB</span>
        </div>

        {/* Ready Time */}
        <div className="flex items-center gap-2">
          <Clock className="size-4" />
          <span>就绪</span>
        </div>

        {/* Project Info */}
        {currentProject && (
          <Badge variant="secondary">
            {currentProject.name}
          </Badge>
        )}
      </div>
    </div>
  );
}