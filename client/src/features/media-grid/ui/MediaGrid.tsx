/** biome-ignore-all lint/a11y: disable all a11y rules */
import { buildImageUrl } from '@/entities/image';
import type { MediaFile } from '@/entities/media-folder';
import { fmtBytes, fmtDuration } from '@/shared/lib';
import { CommonButton, IconButton } from '@/shared/ui/common';
import { Folder, Image, Video, Trash2, Eye, X } from 'lucide-react';

interface MediaGridProps {
  media: MediaFile[];
  isLoading: boolean;

  selectedFiles: Set<string>;
  setSelectedFiles: (set: Set<string>) => void;

  onToggleSelect: (key: string) => void;
  onPreview: (file: MediaFile) => void;
  onDelete: (file: MediaFile) => void;
}

export function MediaGrid({
  media,
  isLoading,
  selectedFiles,
  setSelectedFiles,
  onToggleSelect,
  onPreview,
  onDelete,
}: MediaGridProps) {
  if (isLoading) {
    return (
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-3">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: skeleton
              key={i}
              className="h-42 animate-pulse rounded-lg bg-(--border)"
            />
          ))}
        </div>
      </div>
    );
  }

  if (media.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 p-4">
        <Folder size={48} strokeWidth={1} />
        <p className="text-2xl">Папка пуста</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4">
      <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-3">
        {media.map((file) => {
          const key = `${file.kind}-${file.id}`;
          const isSelected = selectedFiles.has(key);

          return (
            <div
              key={key}
              className={`group relative cursor-pointer overflow-hidden rounded-lg border transition-all ${
                isSelected
                  ? 'border-(--border) ring-(--button-hover-bg)/90 ring-2'
                  : 'border-(--border) hover:border-(--button-hover-bg)/50'
              }`}
              onClick={() => onToggleSelect(key)}
            >
              <div className="relative h-28 overflow-hidden bg-(--background)">
                {file.kind === 'image' ? (
                  <img
                    src={buildImageUrl(file.thumbnail)}
                    alt={file.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <Video size={32} />
                  </div>
                )}

                {file.kind === 'image' ? (
                  <Image size={12} className="absolute bottom-1 left-1" />
                ) : (
                  <Video size={12} className="absolute bottom-1 left-1" />
                )}

                <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                  <IconButton
                    icon={<Eye size={22} />}
                    onClick={(e) => {
                      e.stopPropagation();
                      onPreview(file);
                    }}
                  />

                  <IconButton
                    icon={<Trash2 size={22} />}
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(file);
                    }}
                  />
                </div>
              </div>

              <div className="p-2">
                <p className="truncate font-medium text-xs" title={file.name}>
                  {file.name}
                </p>

                <p className="text-xs">{fmtBytes(file.size)}</p>

                {file.kind === 'video' && (
                  <p className="text-xs">{fmtDuration(file.duration)}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {selectedFiles.size > 0 && (
        <div className="flex items-center gap-3 px-4 py-2">
          <span className="text-(--text-muted) text-sm">
            Выбрано: {selectedFiles.size}
          </span>
          <CommonButton
            type="button"
            onClick={() => setSelectedFiles(new Set())}
            disabled={selectedFiles.size === 0}
          >
            <div className="flex items-center gap-1">
              <X size={14} />
              <span className="text-xs">Снять выделение</span>
            </div>
          </CommonButton>
        </div>
      )}
    </div>
  );
}
