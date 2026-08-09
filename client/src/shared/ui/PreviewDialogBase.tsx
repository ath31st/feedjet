import { CommonDialog } from '@/shared/ui/common';

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
    <CommonDialog
      open={open}
      onOpenChange={onOpenChange}
      size="xl"
      contentClassName="max-w-350 overflow-hidden p-0"
    >
      <CommonDialog.HiddenLabel title="Preview" description="Предпросмотр" />

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
    </CommonDialog>
  );
}
