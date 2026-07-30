/** biome-ignore-all lint/a11y: disable all a11y rules */
import type { ReactNode } from 'react';
import { useFileDropZone } from '@/shared/lib/useFileDropZone';

interface FileDropZoneProps {
  onDrop: (files: File[]) => void;
  children: ReactNode;
  className?: string;
  activeClassName?: string;
  inactiveClassName?: string;
}

export function FileDropZone({
  onDrop,
  children,
  className = '',
  activeClassName = 'border-dashed border-(--button-hover-bg) bg-(--button-hover-bg)/20',
  inactiveClassName = 'border-transparent',
}: FileDropZoneProps) {
  const { isDragOver, onDragOver, onDragLeave, onDrop: handleDrop } =
    useFileDropZone(onDrop);

  return (
    <div
      className={`border-2 transition-colors ${className} ${
        isDragOver ? activeClassName : inactiveClassName
      }`}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={handleDrop}
    >
      {children}
    </div>
  );
}
