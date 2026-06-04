/** biome-ignore-all lint/a11y: disable all a11y rules */
import { buildImageUrl } from '@/entities/image';
import { buildVideoUrl } from '@/entities/video';
import type { MediaFile } from '@/entities/media-folder';
import { fmtBytes, fmtDuration } from '@/shared/lib';
import { ConfirmActionDialog } from '@/shared/ui';
import { IconButton } from '@/shared/ui/common';
import { Folder, Image, Video, Trash2, Eye } from 'lucide-react';
import { useMediaGrid } from '../model/useMediaGrid';

interface MediaGridProps {
  selectedFolderId: number | null;
  selectedFiles: Set<string>;

  onToggleSelect: (key: string) => void;
  onPreview: (file: MediaFile) => void;
}

export function MediaGrid({
  selectedFolderId,
  selectedFiles,
  onToggleSelect,
  onPreview,
}: MediaGridProps) {
  const { handleDeleteFile, isLoading, media, setFailedThumbs, failedThumbs } =
    useMediaGrid({
      selectedFolderId,
    });

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
              className={`group relative cursor-pointer overflow-hidden rounded-lg border transition-all ${
                isSelected
                  ? 'border-(--border) ring-(--button-hover-bg)/90 ring-2'
                  : 'border-(--border) hover:border-(--button-hover-bg)/50'
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

                <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                  <IconButton
                    icon={<Eye size={22} />}
                    onClick={(e) => {
                      e.stopPropagation();
                      onPreview(file);
                    }}
                  />

                  <ConfirmActionDialog
                    confirmText="Удалить"
                    description={`Файл «${file.name}» будет удалён. Все сценарии, в которых он используется, будут обновлены.`}
                    trigger={<IconButton icon={<Trash2 size={22} />} />}
                    title={'Удалить файл?'}
                    onConfirm={(e) => {
                      e.stopPropagation();
                      handleDeleteFile(file);
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
    </div>
  );
}
