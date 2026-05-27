import { buildVideoUrl } from '@/entities/video';
import { Plus, Video } from 'lucide-react';
import { fmtBytes, fmtDuration } from '@/shared/lib';

interface VideoGridProps {
  allVideos: Array<{
    id: number;
    name: string;
    fileName: string;
    duration: number;
    size: number;
    folderId: number | null;
  }>;
  filteredVideos: Array<{
    id: number;
    name: string;
    fileName: string;
    duration: number;
    size: number;
    folderId: number | null;
  }>;
  onAddVideo: (id: number) => void;
}

export function VideoGrid({
  allVideos,
  filteredVideos,
  onAddVideo,
}: VideoGridProps) {
  if (filteredVideos.length === 0) {
    return (
      <div className="rounded-lg border border-(--border) border-dashed py-12 text-center text-(--text-muted) text-sm">
        {allVideos.length === 0
          ? 'Нет видео в медиа-библиотеке'
          : 'В выбранной папке нет видео'}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-3">
      {filteredVideos.map((v) => (
        <button
          key={v.id}
          type="button"
          onClick={() => onAddVideo(v.id)}
          className="group relative overflow-hidden rounded-lg border border-(--border) text-left transition-all hover:border-(--button-hover-bg)/50"
        >
          <div className="relative h-28 overflow-hidden bg-(--background)">
            <video
              src={buildVideoUrl(v.fileName)}
              muted
              preload="metadata"
              className="h-full w-full object-cover"
            />

            <Video
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
            <p className="truncate font-medium text-xs" title={v.name}>
              {v.name}
            </p>
            <p className="mt-0.5 text-(--text-muted) text-xs">
              {fmtBytes(v.size)}
            </p>
            <p className="text-(--text-muted) text-xs">
              {fmtDuration(v.duration)}
            </p>
          </div>
        </button>
      ))}
    </div>
  );
}
