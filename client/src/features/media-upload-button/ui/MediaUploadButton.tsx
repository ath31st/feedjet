import { useRef } from 'react';
import { Upload } from 'lucide-react';
import { CommonButton } from '@/shared/ui/common';
import { useMediaUpload } from '../model/useMediaUpload';

interface MediaUploadButtonProps {
  selectedFolderId: number | null;
}

export function MediaUploadButton({
  selectedFolderId,
}: MediaUploadButtonProps) {
  const { uploading, handleUploadFiles } = useMediaUpload({
    folderId: selectedFolderId,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,video/*"
        className="hidden"
        onChange={(e) => e.target.files && handleUploadFiles(e.target.files)}
      />

      <CommonButton type="button" onClick={() => fileInputRef.current?.click()}>
        <div className="flex flex-row items-center gap-2">
          <Upload size={14} />
          <span className="text-xs">Загрузить</span>
        </div>
      </CommonButton>

      {uploading.length > 0 && (
        <div className="px-4 py-2">
          {uploading.map((item) => (
            <div
              key={item.name}
              className="mb-1 flex items-center gap-2 text-sm"
            >
              <span className="flex-1 truncate">{item.name}</span>
              <div className="h-1.5 w-32 overflow-hidden rounded-full bg-(--border)">
                <div
                  className="h-full transition-all"
                  style={{ width: `${item.progress}%` }}
                />
              </div>
              <span className="w-8 text-right text-xs">{item.progress}%</span>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
