import { buildImageUrl } from '@/entities/image';
import { Plus } from 'lucide-react';
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
      <div className="rounded-lg border border-dashed py-12 text-center text-sm">
        {allImages.length === 0
          ? 'Нет изображений в медиа-библиотеке'
          : 'В выбранной папке нет изображений'}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-4 gap-3">
      {filteredImages.map((img) => (
        <button
          key={img.id}
          type="button"
          onClick={() => onAddImage(img.id)}
          className="group overflow-hidden rounded-lg border text-left transition-all hover:border-blue-500 hover:shadow-lg"
        >
          <div className="relative aspect-video overflow-hidden bg-black">
            <img
              src={buildImageUrl(img.thumbnail)}
              alt={img.name}
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
            />
            <div className="absolute inset-0 flex items-end justify-end bg-linear-to-t from-black/60 via-transparent to-transparent p-1.5 opacity-0 transition-opacity group-hover:opacity-100">
              <Plus
                size={20}
                className="rounded-full bg-blue-500 p-1 text-white shadow-lg"
              />
            </div>
          </div>
          <div className="p-2">
            <div className="truncate font-medium text-xs" title={img.name}>
              {img.name}
            </div>
            <div className="mt-0.5 flex items-center justify-between font-mono text-[10px]">
              <span>
                {img.width}×{img.height}
              </span>
              <span>{fmtBytes(img.size)}</span>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
