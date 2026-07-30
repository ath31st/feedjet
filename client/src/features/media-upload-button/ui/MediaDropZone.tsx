/** biome-ignore-all lint/a11y: disable all a11y rules */
import type { ReactNode } from 'react';
import { useMediaUploadContext } from '../model/MediaUploadContext';

interface MediaDropZoneProps {
  children: ReactNode;
}

export function MediaDropZone({ children }: MediaDropZoneProps) {
  const { isDragOver, handleDragOver, handleDragLeave, handleDrop } =
    useMediaUploadContext();

  return (
    <div
      className={`flex min-h-0 flex-1 flex-col rounded-lg border-2 transition-colors ${
        isDragOver
          ? 'border-(--button-hover-bg) border-dashed bg-(--button-hover-bg)/20'
          : 'border-transparent'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {children}
    </div>
  );
}
