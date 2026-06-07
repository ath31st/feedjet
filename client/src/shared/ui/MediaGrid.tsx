/** biome-ignore-all lint/a11y: disable all a11y rules */
import { buildImageUrl } from '@/entities/image';
import { buildVideoUrl } from '@/entities/video';
import type { MediaFile } from '@/entities/media-folder';
import { fmtBytes, fmtDuration } from '@/shared/lib';
import { Folder, Image, Video } from 'lucide-react';
import { useState } from 'react';

interface MediaGridProps {
  selectedFiles: Set<string>;
  media: MediaFile[];
  isLoading: boolean;

  onToggleSelect: (key: string) => void;
  renderActions?: (file: MediaFile) => React.ReactNode;
}

export function MediaGrid({
  selectedFiles,
  media,
  isLoading,
  onToggleSelect,
  renderActions,
}: MediaGridProps) {
  const [failedThumbs, setFailedThumbs] = useState<Set<string>>(
    () => new Set(),
  );

  if (isLoading) {
    return (
      <div className="flex-1 overflow-y-auto p-2">
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
      <div className="flex flex-1 flex-col items-center justify-center gap-3 p-2">
        <Folder size={48} strokeWidth={1} />
        <p className="text-2xl">Папка пуста</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-2">
      <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-3">
        {media.map((file) => {
          const key = `${file.kind}-${file.id}`;
          const isSelected = selectedFiles.has(key);

          return (
            <div
              key={key}
              className={`group relative cursor-pointer overflow-hidden rounded-lg border border-(--border) transition-all ${
                isSelected
                  ? 'z-10 scale-[1.02] border-(--button-hover-bg) bg-(--button-bg) shadow-lg'
                  : 'hover:border-(--button-hover-bg)/50'
              }`}
              onClick={() => onToggleSelect(key)}
            >
              <div className="relative h-28 overflow-hidden bg-(--background)">
                {(() => {
                  const thumbFailed = failedThumbs.has(key);

                  if (file.kind === 'image') {
                    return !thumbFailed && file.thumbnail ? (
                      <img
                        src={buildImageUrl(file.thumbnail)}
                        alt={file.name}
                        className="h-full w-full object-cover"
                        onError={() =>
                          setFailedThumbs((prev) => {
                            const next = new Set(prev);
                            next.add(key);
                            return next;
                          })
                        }
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <Image size={32} />
                      </div>
                    );
                  }

                  return (
                    <video
                      src={buildVideoUrl(file.fileName)}
                      muted
                      preload="metadata"
                      className="h-full w-full object-cover"
                    />
                  );
                })()}

                {file.kind === 'image' ? (
                  <Image size={12} className="absolute bottom-1 left-1" />
                ) : (
                  <Video size={12} className="absolute bottom-1 left-1" />
                )}

                {isSelected && (
                  <div className="absolute top-2 right-2 z-10 rounded bg-(--button-hover-bg) px-2 py-0.5 text-xs">
                    ✓
                  </div>
                )}

                {renderActions && (
                  <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                    {renderActions(file)}
                  </div>
                )}
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
    </div>
  );
}
