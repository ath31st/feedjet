/** biome-ignore-all lint/a11y: disable all a11y rules */
import { MediaGridSkeleton } from '@/shared/ui';
import { buildImageUrl } from '@/entities/image';
import { buildPdfUrl } from '@/entities/pdf';
import { buildVideoUrl } from '@/entities/video';
import type { MediaFile } from '@/entities/media-folder';
import { fmtBytes, fmtDuration } from '@/shared/lib';
import { FileText, Folder, Image, Video } from 'lucide-react';
import { useState } from 'react';

export interface MediaGridFolder {
  id: number;
  name: string;
}

interface MediaGridProps {
  selectedFiles: Set<string>;
  media: MediaFile[];
  isLoading: boolean;
  folders?: MediaGridFolder[];
  onOpenFolder?: (id: number) => void;
  onToggleSelect: (key: string) => void;
  renderActions?: (file: MediaFile) => React.ReactNode;
}

export function MediaGrid({
  selectedFiles,
  media,
  isLoading,
  folders = [],
  onOpenFolder,
  onToggleSelect,
  renderActions,
}: MediaGridProps) {
  const [failedThumbs, setFailedThumbs] = useState<Set<string>>(
    () => new Set(),
  );

  if (isLoading) {
    return <MediaGridSkeleton />;
  }

  if (media.length === 0 && folders.length === 0) {
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
        {folders.map((folder) => (
          <div
            key={`folder-${folder.id}`}
            className="cursor-pointer overflow-hidden rounded-lg border border-(--border) transition-all hover:border-(--button-hover-bg)/50"
            onClick={() => onOpenFolder?.(folder.id)}
          >
            <div className="relative flex h-28 items-center justify-center overflow-hidden bg-(--background)">
              <Folder size={40} strokeWidth={1.25} />
            </div>

            <div className="p-2">
              <p className="truncate font-medium text-xs" title={folder.name}>
                {folder.name}
              </p>
              <p className="text-xs">Папка</p>
            </div>
          </div>
        ))}

        {media.map((file) => {
          const key = `${file.kind}-${file.id}`;
          const isSelected = selectedFiles.has(key);
          const thumbFailed = failedThumbs.has(key);
          const thumbSrc =
            file.kind === 'image'
              ? file.thumbnail
                ? buildImageUrl(file.thumbnail)
                : null
              : file.kind === 'video'
                ? file.thumbnail
                  ? buildVideoUrl(file.thumbnail)
                  : null
                : file.thumbnail
                  ? buildPdfUrl(file.thumbnail)
                  : null;
          const FallbackIcon =
            file.kind === 'image'
              ? Image
              : file.kind === 'video'
                ? Video
                : FileText;

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
                {!thumbFailed && thumbSrc ? (
                  <img
                    src={thumbSrc}
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
                    <FallbackIcon size={32} />
                  </div>
                )}

                <FallbackIcon size={12} className="absolute bottom-1 left-1" />

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
                {file.kind === 'pdf' && (
                  <p className="text-xs">{file.pageCount} стр.</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
