import { useState, useRef } from 'react';
import { Upload, Download, ZoomIn, ZoomOut, RotateCw, Maximize2 } from 'lucide-react';
import { useAppStore } from '../lib/store';
import { Button } from './ui/button';
import { Card } from './ui/card';

export function ImagePreview() {
  const { currentProject, uploadImage } = useAppStore();
  const [zoom, setZoom] = useState(100);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const imageData = event.target?.result as string;
      uploadImage(imageData);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex h-full flex-col">
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b bg-white px-4 py-3">
        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="size-4" />
            上传图片
          </Button>
          {currentProject?.originalImage && (
            <Button variant="outline" size="sm">
              <Download className="size-4" />
              导出结果
            </Button>
          )}
        </div>

        {currentProject?.originalImage && (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setZoom(Math.max(25, zoom - 25))}
            >
              <ZoomOut className="size-4" />
            </Button>
            <span className="min-w-[4rem] text-center">{zoom}%</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setZoom(Math.min(200, zoom + 25))}
            >
              <ZoomIn className="size-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <RotateCw className="size-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Maximize2 className="size-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Preview Area */}
      <div className="flex flex-1 items-center justify-center bg-gray-100 p-8">
        {currentProject?.originalImage ? (
          <Card className="relative overflow-hidden bg-white p-4 shadow-lg">
            <img
              src={currentProject.originalImage}
              alt="Preview"
              style={{ transform: `scale(${zoom / 100})` }}
              className="max-h-[600px] max-w-full rounded transition-transform"
            />
          </Card>
        ) : (
          <div className="text-center">
            <div className="mx-auto mb-4 flex size-24 items-center justify-center rounded-full bg-gray-200">
              <Upload className="size-12 text-gray-400" />
            </div>
            <h3 className="mb-2">上传图片开始编辑</h3>
            <p className="mb-4 text-gray-600">
              支持 JPG, PNG, WebP 格式，最大 10MB
            </p>
            <Button onClick={() => fileInputRef.current?.click()}>
              <Upload className="size-4" />
              选择图片
            </Button>
          </div>
        )}
      </div>

      {/* Image Info */}
      {currentProject?.originalImage && (
        <div className="border-t bg-white px-4 py-2">
          <div className="flex items-center justify-between text-gray-600">
            <span>原图尺寸: 1920 × 1080</span>
            <span>文件大小: 2.4 MB</span>
            <span>格式: JPEG</span>
          </div>
        </div>
      )}
    </div>
  );
}