import { Cross2Icon, InfoCircledIcon } from '@radix-ui/react-icons';
import { CommonDialog } from '@/shared/ui/common';

interface HelpDialogProps {
  title: string;
  content: React.ReactNode;
  open: boolean;
  onClose: () => void;
}

export function HelpDialog({ title, content, open, onClose }: HelpDialogProps) {
  return (
    <CommonDialog
      open={open}
      onClose={onClose}
      size="lg"
      contentClassName="max-h-[85vh] overflow-y-auto"
    >
      <CommonDialog.Header
        icon={<InfoCircledIcon className="h-5 w-5" />}
        iconVariant="inline"
        title={title}
        actions={
          <button
            type="button"
            className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-(--text-secondary) hover:text-(--text-primary)"
            aria-label="Закрыть"
            onClick={onClose}
          >
            <Cross2Icon />
          </button>
        }
      />

      <CommonDialog.Body className="text-(--text-secondary) text-sm">
        {content}
      </CommonDialog.Body>
    </CommonDialog>
  );
}
