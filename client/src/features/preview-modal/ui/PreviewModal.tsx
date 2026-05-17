/** biome-ignore-all lint/a11y: disable all a11y rules */
import { X } from 'lucide-react';
import { PreviewMediaBase } from './PreviewMediaBase';
import { Description } from './Description';
import type { PreviewDescription } from '..';

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
      <button
        className="absolute top-6 right-6 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition-colors hover:bg-white/20"
        onClick={onClose}
        aria-label="Закрыть"
      >
        <X size={22} />
      </button>

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
