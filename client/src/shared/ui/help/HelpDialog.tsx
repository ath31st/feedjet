import * as Dialog from '@radix-ui/react-dialog';
import { Cross2Icon, InfoCircledIcon } from '@radix-ui/react-icons';

interface HelpDialogProps {
  title: string;
  content: React.ReactNode;
  open: boolean;
  onClose: () => void;
}

export function HelpDialog({ title, content, open, onClose }: HelpDialogProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 max-h-[85vh] w-2xl max-w-[90vw] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-lg bg-(--card-bg) p-6 shadow-xl">
          <div className="mb-4 flex items-center gap-2">
            <InfoCircledIcon className="h-5 w-5 text-(--text-secondary)" />
            <Dialog.Title className="font-semibold text-lg">
              {title}
            </Dialog.Title>
          </div>

          <Dialog.Description className="sr-only" />

          <div className="text-(--text-secondary) text-sm">{content}</div>

          <Dialog.Close asChild>
            <button
              type="button"
              className="absolute top-4 right-4 inline-flex h-6 w-6 items-center justify-center rounded-full text-(--text-secondary) hover:text-(--text-primary)"
              aria-label="Закрыть"
            >
              <Cross2Icon />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
