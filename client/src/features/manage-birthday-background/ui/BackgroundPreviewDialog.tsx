import * as Dialog from '@radix-ui/react-dialog';
import {
  buildBackgroundUrl,
  type BirthdayBackground,
} from '@/entities/birthday-background';
import { IconButton } from '@/shared/ui/common';
import { Cross1Icon, ResetIcon, UpdateIcon } from '@radix-ui/react-icons';

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
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="-translate-x-1/2 -translate-y-1/2 fixed top-1/2 left-1/2 w-[90vw] max-w-[1400px] overflow-hidden rounded-lg bg-[var(--card-bg)]">
          <Dialog.Description className="sr-only">
            Предпросмотр фона
          </Dialog.Description>
          <Dialog.Title className="sr-only">Предпросмотр</Dialog.Title>
          {previewUrl && (
            <img
              src={previewUrl}
              alt=""
              className="h-auto w-full object-contain"
            />
          )}
          <div className="flex justify-end gap-4 border-[var(--border)] border-t p-3">
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
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
