import * as Dialog from '@radix-ui/react-dialog';

interface PreviewDialogBaseProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageUrl: string | null;
  footer?: React.ReactNode;
}

export function PreviewDialogBase({
  open,
  onOpenChange,
  imageUrl,
  footer,
}: PreviewDialogBaseProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 w-[90vw] max-w-350 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-lg bg-(--card-bg)">
          <Dialog.Description className="sr-only">
            Предпросмотр
          </Dialog.Description>
          <Dialog.Title className="sr-only">Preview</Dialog.Title>

          {imageUrl && (
            <img
              src={imageUrl}
              alt=""
              className="max-h-[90vh] w-full object-contain"
            />
          )}

          {footer && (
            <div className="pointer-events-none absolute right-3 bottom-3">
              <div className="pointer-events-auto flex gap-2">{footer}</div>
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
