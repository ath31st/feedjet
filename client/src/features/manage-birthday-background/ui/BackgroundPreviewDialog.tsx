import {
  buildBackgroundUrl,
  type BirthdayBackground,
} from '@/entities/birthday-background';
import { IconButton } from '@/shared/ui/common';
import { Cross1Icon, ResetIcon, UpdateIcon } from '@radix-ui/react-icons';
import { PreviewDialogBase } from '@/shared/ui';

interface BackgroundPreviewDialogProps {
  open: boolean;
  onOpenChange: () => void;
  backgrounds: BirthdayBackground[];
  previewMonth: number | null;
  onDelete: () => void;
  onReplace: () => void;
}

export function BackgroundPreviewDialog({
  open,
  onOpenChange,
  backgrounds,
  previewMonth,
  onDelete,
  onReplace,
}: BackgroundPreviewDialogProps) {
  const current = backgrounds.find((b) => b.monthNumber === previewMonth);
  const previewUrl = current?.fileName
    ? `${buildBackgroundUrl(current.fileName)}?v=${current.mtime}`
    : null;

  return (
    <PreviewDialogBase
      open={open}
      onOpenChange={onOpenChange}
      imageUrl={previewUrl}
      footer={
        <>
          <IconButton
            onClick={onDelete}
            tooltip="Удалить"
            icon={<Cross1Icon className="h-5 w-5 cursor-pointer" />}
          />
          <IconButton
            onClick={onReplace}
            tooltip="Заменить"
            icon={<UpdateIcon className="h-5 w-5 cursor-pointer" />}
          />
          <IconButton
            onClick={onOpenChange}
            tooltip="Закрыть"
            icon={<ResetIcon className="h-5 w-5 cursor-pointer" />}
          />
        </>
      }
    />
  );
}
