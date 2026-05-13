import { Upload } from 'lucide-react';

interface UploadOverlayProps {
  visible: boolean;
}

export function UploadOverlay({ visible }: UploadOverlayProps) {
  if (!visible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="rounded-lg border-(--border) border-4 border-dashed bg-black/70 p-12 text-center">
        <Upload size={48} className="mx-auto mb-4 opacity-80" />

        <p className="font-semibold text-2xl">Перетащите файлы для загрузки</p>
      </div>
    </div>
  );
}
