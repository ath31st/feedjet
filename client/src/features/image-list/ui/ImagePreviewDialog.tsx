import { buildImageUrl, type ImageMetadata } from '@/entities/image';
import { IconButton } from '@/shared/ui/common';
import { ResetIcon } from '@radix-ui/react-icons';
import { PreviewDialogBase } from '@/shared/ui';

interface ImagePreviewDialogProps {
  image: ImageMetadata | null;
  onClose: () => void;
}

export function ImagePreviewDialog({
  image,
  onClose,
}: ImagePreviewDialogProps) {
  if (!image) return null;

  const previewUrl = image.fileName
    ? `${buildImageUrl(image.fileName)}?v=${image.mtime}`
    : null;

  return (
    <PreviewDialogBase
      open={true}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      imageUrl={previewUrl}
      footer={
        <IconButton
          onClick={onClose}
          tooltip="Закрыть"
          icon={<ResetIcon className="h-5 w-5 cursor-pointer" />}
        />
      }
    />
  );
}
