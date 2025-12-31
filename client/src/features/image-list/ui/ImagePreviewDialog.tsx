import * as Dialog from '@radix-ui/react-dialog';
import { buildImageUrl, type ImageMetadata } from '@/entities/image';
import { IconButton } from '@/shared/ui/common';
import { ResetIcon } from '@radix-ui/react-icons';

interface ImagePreviewDialogProps {
  image: ImageMetadata | null;
  onClose: () => void;
}

export function ImagePreviewDialog({
  image,
  onClose,
}: ImagePreviewDialogProps) {
  if (!image) return null;

  const previewUrl = image?.fileName
    ? `${buildImageUrl(image.fileName)}?v=${image.mtime}`
    : null;

  return (
    <Dialog.Root open={!!image} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 w-auto max-w-[90vw] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-[var(--card-bg)] p-5 shadow-xl">
          <Dialog.Title className="mb-4 font-semibold text-lg">
            {image.name}
          </Dialog.Title>
          <Dialog.Description className="sr-only">
            Просмотр изображения
          </Dialog.Description>

          {previewUrl && (
            <img
              src={previewUrl}
              alt=""
              className="h-auto w-full object-contain"
            />
          )}
          <div className="flex justify-end gap-4 border-[var(--border)] border-t p-3">
            <IconButton
              onClick={onClose}
              tooltip="Закрыть"
              icon={<ResetIcon className="h-5 w-5 cursor-pointer" />}
            />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
