import { useCallback, useMemo, useRef, useState } from 'react';
import { Upload, Download, ZoomIn, ZoomOut, RotateCw } from 'lucide-react';
import { useAppStore } from '../lib/store';
import { Button } from './ui/button';
import { Card } from './ui/card';

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function useZoom(initial = 100) {
  const [value, setValue] = useState(initial);
  const zoomIn = useCallback(() => setValue((prev) => clamp(prev + 25, 25, 300)), []);
  const zoomOut = useCallback(() => setValue((prev) => clamp(prev - 25, 25, 300)), []);
  const resetZoom = useCallback(() => setValue(initial), [initial]);
  return { value, zoomIn, zoomOut, resetZoom };
}

type ImageInfo = {
  width: number;
  height: number;
  size: string;
  format: string;
};

function extractImageInfo(dataUrl: string): ImageInfo | null {
  const base64 = dataUrl.split(',')[1];
  if (!base64) return null;

  const byteLength = (base64.length * 3) / 4 - (base64.endsWith('==') ? 2 : base64.endsWith('=') ? 1 : 0);
  const size = `${(byteLength / (1024 * 1024)).toFixed(2)} MB`;

  const formatMatch = dataUrl.match(/^data:image\/([^;]+);base64,/);
  const format = formatMatch ? formatMatch[1].toUpperCase() : 'Unknown';

  const img = new Image();
  img.src = dataUrl;

  return {
    width: img.width || 0,
    height: img.height || 0,
    size,
    format,
  };
}

function PreviewCard({
  title,
  image,
  zoom,
}: {
  title: string;
  image: string;
  zoom: number;
}) {
  const info = useMemo(() => extractImageInfo(image), [image]);

  return (
    <Card className="flex h-full w-full flex-col overflow-hidden bg-white p-4 shadow-lg">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        {info && (
          <span className="text-xs text-gray-400">
            {info.width}×{info.height} ｜ {info.size} ｜ {info.format}
          </span>
        )}
      </div>
      <div className="flex flex-1 items-center justify-center bg-gray-50">
        <img
          src={image}
          alt={title}
          style={{ transform: `scale(${zoom / 100})` }}
          className="max-h-[480px] max-w-full rounded transition-transform"
        />
      </div>
    </Card>
  );
}

export function ImagePreview() {
  const { currentProject, uploadImage, setResultImage } = useAppStore();
  const { value: zoom, zoomIn, zoomOut, resetZoom } = useZoom();
  const resultZoom = useZoom();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      alert('文件超过 10MB 限制，请重新选择');
      return;
    }
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      alert('仅支持 JPG、PNG、WebP 格式');
      return;
    }

    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      const imageData = loadEvent.target?.result as string;
      uploadImage(imageData);
      resetZoom();
      resultZoom.resetZoom();
    };
    reader.readAsDataURL(file);
  };

  const handleDownload = () => {
    if (!currentProject?.resultImage) return;
    const link = document.createElement('a');
    link.href = currentProject.resultImage;
    link.download = `ct-ai-result-${Date.now()}.png`;
    link.click();
  };

  const hasOriginal = Boolean(currentProject?.originalImage);
  const hasResult = Boolean(currentProject?.resultImage);

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b bg-white px-4 py-3">
        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileUpload}
            className="hidden"
          />
          <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
            <Upload className="size-4" />
            上传图片
          </Button>
          {hasResult && (
            <Button variant="outline" size="sm" onClick={handleDownload}>
              <Download className="size-4" />
              导出结果
            </Button>
          )}
        </div>

        {hasOriginal && (
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" onClick={zoomOut}>
              <ZoomOut className="size-4" />
            </Button>
            <span className="min-w-[4rem] text-center">{zoom}%</span>
            <Button variant="ghost" size="icon" onClick={zoomIn}>
              <ZoomIn className="size-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={resetZoom}>
              <RotateCw className="size-4" />
            </Button>
          </div>
        )}
      </div>

      <div className="flex flex-1 gap-4 bg-gray-100 p-6">
        {!hasOriginal ? (
          <div className="flex flex-1 items-center justify-center">
            <div className="text-center">
              <div className="mx-auto mb-4 flex size-24 items-center justify-center rounded-full bg-gray-200">
                <Upload className="size-12 text-gray-400" />
              </div>
              <h3 className="mb-2">上传图片开始编辑</h3>
              <p className="mb-4 text-gray-600">支持 JPG, PNG, WebP 格式，最大 10MB</p>
              <Button onClick={() => fileInputRef.current?.click()}>
                <Upload className="size-4" />
                选择图片
              </Button>
            </div>
          </div>
        ) : (
          <>
            {currentProject?.originalImage && (
              <div className={`flex-1`}>
                <PreviewCard title="原图" image={currentProject.originalImage} zoom={zoom} />
              </div>
            )}
            <div className="flex-1">
              {currentProject?.resultImage ? (
                <PreviewCard title="结果" image={currentProject.resultImage} zoom={resultZoom.value} />
              ) : (
                <Card className="flex h-full flex-col items-center justify-center bg-white text-gray-400">
                  <p className="text-sm">执行模块后将在此显示生成结果</p>
                </Card>
              )}
            </div>
          </>
        )}
      </div>

      {hasOriginal && (
        <div className="flex flex-wrap items-center justify-between gap-2 border-t bg-white px-4 py-2 text-sm text-gray-600">
          <span>当前项目：{currentProject?.name ?? '未命名项目'}</span>
          <span>
            原图状态：{currentProject?.originalImage ? '已上传' : '未上传'} ｜ 结果状态：
            {currentProject?.resultImage ? '已生成' : '待生成'}
          </span>
          {hasResult && (
            <Button variant="ghost" size="sm" onClick={() => setResultImage(null)}>
              清除结果
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
