import * as Dialog from '@radix-ui/react-dialog';
import { buildVideoUrl, type VideoMetadata } from '@/entities/video';
import { usePersistentVolume } from '../model/usePersistentVolume';

interface VideoPreviewDialogProps {
  video: VideoMetadata | null;
  onClose: () => void;
}

export function VideoPreviewDialog({
  video,
  onClose,
}: VideoPreviewDialogProps) {
  const videoRef = usePersistentVolume();

  if (!video) return null;
  const videoUrl = buildVideoUrl(video.fileName);

  return (
    <Dialog.Root open={!!video} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="-translate-x-1/2 -translate-y-1/2 fixed top-1/2 left-1/2 w-auto max-w-[90vw] rounded-lg bg-[var(--card-bg)] p-5 shadow-xl">
          <Dialog.Title className="mb-4 font-semibold text-lg">
            {video.name}
          </Dialog.Title>
          <Dialog.Description className="sr-only">
            Просмотр видео
          </Dialog.Description>

          <video
            ref={videoRef}
            src={videoUrl}
            controls
            autoPlay
            className="h-auto max-h-[80vh] max-w-[80vw] rounded-lg"
          >
            <track kind="captions" label="no captions" />
          </video>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
