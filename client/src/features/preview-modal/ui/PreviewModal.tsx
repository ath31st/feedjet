/** biome-ignore-all lint/a11y: disable all a11y rules */
import { X } from 'lucide-react';
import { PreviewMediaBase } from './PreviewMediaBase';
import { Description } from './Description';
import type { PreviewDescription } from '..';
import { IconButton } from '@/shared/ui/common';

interface PreviewModalProps {
  open: boolean;

  kind?: 'image' | 'video';
  src?: string;
  alt?: string;
  videoMuted?: boolean;

  description?: PreviewDescription;

  onClose: () => void;

  overlayClassName?: string;
}
export function PreviewModal({
  open,
  kind,
  src,
  alt,
  description,
  videoMuted,
  onClose,
  overlayClassName,
}: PreviewModalProps) {
  if (!open || !src || !kind) return null;

  return (
    <div
      className={[
        'fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-black/90 p-8',
        overlayClassName,
      ]
        .filter(Boolean)
        .join(' ')}
      onClick={onClose}
    >
      <div className="absolute top-6 right-6 z-10">
        <IconButton
          onClick={onClose}
          icon={<X className="h-8 w-8 cursor-pointer" />}
          ariaLabel="Закрыть"
        />
      </div>

      <div
        className="flex max-h-[calc(100vh-160px)] max-w-[calc(100vw-96px)] items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <PreviewMediaBase
          kind={kind}
          src={src}
          alt={alt}
          videoMuted={videoMuted}
        />
      </div>

      <Description {...description} />
    </div>
  );
}
