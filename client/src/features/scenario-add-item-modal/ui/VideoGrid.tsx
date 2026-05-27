import { fmtBytes, fmtDuration } from '@/shared/lib';
import { buildVideoUrl } from '@/entities/video';
import { Plus } from 'lucide-react';

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
      <div className="rounded-lg border border-dashed py-12 text-center text-sm">
        {allVideos.length === 0
          ? 'Нет видео в медиа-библиотеке'
          : 'В выбранной папке нет видео'}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-3">
      {filteredVideos.map((v) => (
        <button
          key={v.id}
          type="button"
          onClick={() => onAddVideo(v.id)}
          className="group overflow-hidden rounded-lg border text-left transition-all hover:border-blue-500 hover:shadow-lg"
        >
          <div className="relative aspect-video overflow-hidden bg-black">
            <video
              src={buildVideoUrl(v.fileName)}
              muted
              preload="metadata"
              className="h-full w-full object-cover"
            />
            <div className="absolute top-1.5 right-1.5 rounded bg-black/70 px-1.5 py-0.5 font-mono text-[10px] text-white">
              {fmtDuration(v.duration)}
            </div>
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity group-hover:opacity-100">
              <Plus
                size={28}
                className="rounded-full bg-blue-500 p-1.5 text-white shadow-lg"
              />
            </div>
          </div>
          <div className="p-2">
            <div className="truncate font-medium text-xs" title={v.name}>
              {v.name}
            </div>
            <div className="mt-0.5 font-mono text-[10px]">
              {fmtBytes(v.size)}
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
