import type { VideoMetadata } from '@/entities/video';
import { useRemoveVideoFile, useVideoWithMetadataList } from '@/entities/video';
import { formatBytes } from '@/shared/lib/formatBytes';
import { Cross1Icon, EyeOpenIcon } from '@radix-ui/react-icons';
import { useState } from 'react';
import { VideoPreviewDialog } from './VideoPreviewDialog';
import { formatDuration } from '@/shared/lib/formatDuration';
import { IconButton } from '@/shared/ui/common/IconButton';

const SERVER_URL = import.meta.env.VITE_API_URL;

export function VideoList() {
  const videos: VideoMetadata[] = useVideoWithMetadataList().data || [];
  const { mutate: removeVideo, isPending } = useRemoveVideoFile();
  const [openVideo, setOpenVideo] = useState<VideoMetadata | null>(null);

  const handleRemoveVideo = (videoName: string) => {
    removeVideo({ filename: videoName });
  };

  if (!videos.length) {
    return (
      <div className="text-[var(--meta-text)] text-sm">
        Нет загруженных видео
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-x-6 gap-y-2">
        {videos
          .sort((a, b) => a.createdAt - b.createdAt)
          .map((v) => (
            <div
              key={v.fileName}
              className="flex items-center justify-between rounded-lg border border-[var(--border)] px-4 py-2"
            >
              <div className="flex flex-col overflow-hidden">
                <span className=" truncate">{v.name}</span>
                <span className="text-[var(--meta-text)] text-xs">
                  {formatDuration(v.duration)} · {v.width}x{v.height}px ·{' '}
                  {v.format} · {formatBytes(v.size)}
                </span>
              </div>

              <div className="ml-2 flex flex-shrink-0 items-center gap-2">
                <IconButton
                  disabled={isPending}
                  onClick={() => setOpenVideo(v)}
                  icon={<EyeOpenIcon className="h-4 w-4 cursor-pointer" />}
                />

                <IconButton
                  disabled={isPending}
                  onClick={() => handleRemoveVideo(v.fileName)}
                  icon={<Cross1Icon className="h-4 w-4 cursor-pointer" />}
                />
              </div>
            </div>
          ))}
      </div>

      <VideoPreviewDialog
        video={openVideo}
        onClose={() => setOpenVideo(null)}
        serverUrl={SERVER_URL}
      />
    </>
  );
}
