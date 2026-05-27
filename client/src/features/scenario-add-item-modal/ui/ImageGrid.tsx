import { buildImageUrl } from '@/entities/image';
import { Plus, Image } from 'lucide-react';
import { fmtBytes } from '@/shared/lib';

interface ImageGridProps {
  allImages: Array<{
    id: number;
    name: string;
    thumbnail: string;
    size: number;
    width: number;
    height: number;
    folderId: number | null;
  }>;
  filteredImages: Array<{
    id: number;
    name: string;
    thumbnail: string;
    size: number;
    width: number;
    height: number;
    folderId: number | null;
  }>;
  onAddImage: (id: number) => void;
}

export function ImageGrid({
  allImages,
  filteredImages,
  onAddImage,
}: ImageGridProps) {
  if (filteredImages.length === 0) {
    return (
      <div className="rounded-lg border border-(--border) border-dashed py-12 text-center text-(--text-muted) text-sm">
        {allImages.length === 0
          ? 'Нет изображений в медиа-библиотеке'
          : 'В выбранной папке нет изображений'}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-3">
      {filteredImages.map((img) => (
        <button
          key={img.id}
          type="button"
          onClick={() => onAddImage(img.id)}
          className="group relative overflow-hidden rounded-lg border border-(--border) text-left transition-all hover:border-(--button-hover-bg)/50"
        >
          <div className="relative h-28 overflow-hidden bg-(--background)">
            {img.thumbnail ? (
              <img
                src={buildImageUrl(img.thumbnail)}
                alt={img.name}
                className="h-full w-full object-cover transition-transform group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <Image size={32} className="text-(--text-muted)" />
              </div>
            )}

            <Image
              size={12}
              className="absolute bottom-1 left-1 text-(--text-muted)"
            />

            <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
              <div className="rounded-full bg-(--button-hover-bg) p-2 text-white shadow-lg">
                <Plus size={22} />
              </div>
            </div>
          </div>

          <div className="p-2">
            <p className="truncate font-medium text-xs" title={img.name}>
              {img.name}
            </p>
            <p className="mt-0.5 text-(--text-muted) text-xs">
              {img.width}×{img.height} • {fmtBytes(img.size)}
            </p>
          </div>
        </button>
      ))}
    </div>
  );
}
