import * as Dialog from '@radix-ui/react-dialog';
import type { VideoMetadata } from '@/entities/video';

interface VideoPreviewDialogProps {
  video: VideoMetadata | null;
  onClose: () => void;
  serverUrl: string;
}

export function VideoPreviewDialog({
  video,
  onClose,
  serverUrl,
}: VideoPreviewDialogProps) {
  if (!video) return null;

  return (
    <Dialog.Root open={!!video} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="-translate-x-1/2 -translate-y-1/2 fixed top-1/2 left-1/2 w-auto max-w-[90vw] rounded-md bg-[var(--card-bg)] p-5 shadow-xl">
          <Dialog.Title className="mb-4 font-semibold text-lg">
            {video.name}
          </Dialog.Title>
          <Dialog.Description className="sr-only">
            Просмотр видео
          </Dialog.Description>

          <video
            src={`${serverUrl}/video/${video.fileName}`}
            controls
            autoPlay
            className="h-auto max-h-[80vh] max-w-[90vw] rounded-lg"
          >
            <track kind="captions" label="no captions" />
          </video>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
