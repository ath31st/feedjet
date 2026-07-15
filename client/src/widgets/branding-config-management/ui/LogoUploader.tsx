import { useRef } from 'react';
import { useLogo } from '../model/useLogo';
import defaultLogo from '@/shared/assets/default_logo.png';
import { Trash, Upload } from 'lucide-react';
import { CommonButton } from '@/shared/ui/common';

export function LogoUploader() {
  const {
    logoUrl,
    isLoading,
    isUploading,
    handleSelectFile,
    handleDeleteLogo,
    isDeleting,
  } = useLogo();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageSrc = logoUrl ?? defaultLogo;

  return (
    <div className="relative h-150 overflow-hidden rounded-lg">
      <img
        src={isLoading ? defaultLogo : imageSrc}
        alt="Логотип организации"
        className="size-full object-contain"
      />

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/svg+xml"
        hidden
        onChange={handleSelectFile}
      />

      <div className="absolute right-2 bottom-2 flex gap-2">
        <CommonButton
          type="button"
          disabled={isDeleting || isLoading || logoUrl === null}
          onClick={handleDeleteLogo}
          tooltip="Удалить логотип"
        >
          <Trash size={15} />
        </CommonButton>

        <CommonButton
          type="button"
          disabled={isUploading}
          onClick={() => fileInputRef.current?.click()}
          tooltip="Загрузить логотип"
        >
          <Upload size={15} />
        </CommonButton>
      </div>
    </div>
  );
}
