import type { ReactNode } from 'react';
import { FileDropZone } from '@/shared/ui';
import { useMediaUploadContext } from '../model/MediaUploadContext';

interface MediaDropZoneProps {
  children: ReactNode;
}

export function MediaDropZone({ children }: MediaDropZoneProps) {
  const { handleUploadFiles } = useMediaUploadContext();

  return (
    <FileDropZone
      onDrop={handleUploadFiles}
      className="flex min-h-0 flex-1 flex-col rounded-lg"
    >
      {children}
    </FileDropZone>
  );
}
