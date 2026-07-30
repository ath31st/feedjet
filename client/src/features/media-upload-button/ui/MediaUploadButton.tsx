import { useRef } from 'react';
import { Upload } from 'lucide-react';
import { CommonButton } from '@/shared/ui/common';
import { useMediaUploadContext } from '../model/MediaUploadContext';

export function MediaUploadButton() {
  const { uploading, handleUploadFiles } = useMediaUploadContext();
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

      <CommonButton
        type="button"
        disabled={uploading.length > 0}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="flex flex-row items-center gap-2">
          <Upload size={14} />
          <span className="text-xs">Загрузить</span>
        </div>
      </CommonButton>
    </>
  );
}
