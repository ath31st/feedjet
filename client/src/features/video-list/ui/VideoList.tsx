import type { VideoMetadata } from '@/entities/video';
import { useVideoFile, useVideoWithMetadataList } from '@/entities/video';
import { formatBytes } from '@/shared/lib/formatBytes';
import { Cross2Icon } from '@radix-ui/react-icons';

export function VideoList() {
  const videos: VideoMetadata[] = useVideoWithMetadataList().data || [];
  const removeVideo = useVideoFile();

  function formatDuration(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  const handleRemoveVideo = (videoName: string) => {
    removeVideo.mutate({ filename: videoName });
  };

  if (!videos.length) {
    return (
      <div className="text-[var(--meta-text)] text-sm">
        Нет загруженных видео
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-2">
      {videos
        .sort((a, b) => a.createdAt - b.createdAt)
        .map((v) => (
          <div
            key={v.fileName}
            className="flex items-center justify-between rounded-lg border border-[var(--border)] px-4 py-2"
          >
            <div className="flex flex-col">
              <span className="truncate">{v.name}</span>
              <span className="text-[var(--meta-text)] text-xs">
                {formatDuration(v.duration)} · {v.width}x{v.height}px ·{' '}
                {v.format} · {formatBytes(v.size)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleRemoveVideo(v.fileName)}
                className="bg-transparent p-1 hover:opacity-60"
              >
                <Cross2Icon className="h-4 w-4 cursor-pointer" />
              </button>
            </div>
          </div>
        ))}
    </div>
  );
}
