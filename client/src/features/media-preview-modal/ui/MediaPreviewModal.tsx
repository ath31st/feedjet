/** biome-ignore-all lint/a11y: disable all a11y rules */
import { buildImageUrl } from '@/entities/image';
import type { MediaFile } from '@/entities/media-folder';
import { buildVideoUrl } from '@/entities/video';
import { fmtBytes, fmtDuration } from '@/shared/lib';
import { X } from 'lucide-react';

interface MediaPreviewModalProps {
  file: MediaFile | null;
  onClose: () => void;
}

export function MediaPreviewModal({ file, onClose }: MediaPreviewModalProps) {
  if (!file) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 p-8"
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
        {file.kind === 'image' ? (
          <img
            src={buildImageUrl(file.fileName)}
            alt={file.name}
            className="max-h-[calc(100vh-160px)] max-w-[calc(100vw-96px)] rounded-lg object-contain shadow-2xl"
          />
        ) : (
          <video
            src={buildVideoUrl(file.fileName)}
            controls
            autoPlay
            className="max-h-[calc(100vh-160px)] max-w-[calc(100vw-96px)] rounded-lg shadow-2xl"
          />
        )}
      </div>

      <div
        className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-1 rounded-lg bg-(--card-bg)/70 px-5 py-3 text-sm backdrop-blur"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="font-semibold">{file.name}</span>

        <span className="text-(--meta-text)">{file.format.toUpperCase()}</span>

        <span className="font-mono text-(--meta-text)">
          {file.width}×{file.height}
        </span>

        <span className="text-(--meta-text)">{fmtBytes(file.size)}</span>

        {file.kind === 'video' && (
          <span className="text-(--meta-text)">
            {fmtDuration(file.duration)}
          </span>
        )}
      </div>
    </div>
  );
}
