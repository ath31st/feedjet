/** biome-ignore-all lint/a11y: disable all a11y rules */
import { X } from 'lucide-react';
import type { PreviewMediaState } from '..';

interface ScenarioPreviewModalProps {
  preview: PreviewMediaState | null;
  onClose: () => void;
}

export function ScenarioPreviewModal({
  preview,
  onClose,
}: ScenarioPreviewModalProps) {
  if (!preview) return null;

  return (
    <div
      className="fixed inset-0 z-60 flex flex-col items-center justify-center bg-black/50 p-8"
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
        className="flex max-h-[calc(100vh-120px)] max-w-[calc(100vw-96px)] items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        {preview.kind === 'image' ? (
          <img
            src={preview.src}
            alt={preview.name}
            className="max-h-[calc(100vh-120px)] max-w-[calc(100vw-96px)] rounded-lg object-contain shadow-2xl"
          />
        ) : (
          <video
            src={preview.src}
            controls
            autoPlay
            className="max-h-[calc(100vh-120px)] max-w-[calc(100vw-96px)] rounded-lg shadow-2xl"
          />
        )}
      </div>

      <div
        className="mt-4 rounded bg-white/10 px-4 py-2 text-sm text-white backdrop-blur"
        onClick={(e) => e.stopPropagation()}
      >
        {preview.name}
      </div>
    </div>
  );
}
