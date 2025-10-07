import type { VideoMetadata } from '@/entities/video';
import {
  useRemoveVideoFile,
  useUpdateIsActiveVideoWithMetadata,
  useVideoWithMetadataList,
} from '@/entities/video';
import { formatBytes } from '@/shared/lib';
import { Cross1Icon, EyeOpenIcon } from '@radix-ui/react-icons';
import { useState } from 'react';
import { VideoPreviewDialog } from './VideoPreviewDialog';
import { formatDuration } from '@/shared/lib/formatDuration';
import { IconButton } from '@/shared/ui/common';
import * as Switch from '@radix-ui/react-switch';
import { SERVER_URL } from '@/shared/config';

export function VideoList() {
  const videos: VideoMetadata[] = useVideoWithMetadataList().data || [];
  const { mutate: removeVideo, isPending } = useRemoveVideoFile();
  const { mutate: updateIsActive, isPending: isActivePending } =
    useUpdateIsActiveVideoWithMetadata();
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
                <Switch.Root
                  checked={v.isActive}
                  disabled={isActivePending}
                  onCheckedChange={(checked) =>
                    updateIsActive({ filename: v.fileName, isActive: checked })
                  }
                  className="relative h-5 w-10 shrink-0 cursor-pointer rounded-full border border-[var(--border)] transition-colors data-[state=checked]:bg-[var(--button-bg)]"
                >
                  <Switch.Thumb className="block h-4 w-4 translate-x-[1px] rounded-full bg-[var(--text)] transition-transform data-[state=checked]:translate-x-[21px]" />
                </Switch.Root>

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
