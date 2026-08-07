import { CommonButton, CommonDialog } from '@/shared/ui/common';

interface UnsavedChangesDialogProps {
  open: boolean;
  onStay: () => void;
  onDiscard: () => void;
}

export function UnsavedChangesDialog({
  open,
  onStay,
  onDiscard,
}: UnsavedChangesDialogProps) {
  return (
    <CommonDialog open={open} size="sm" onClose={onStay}>
      <CommonDialog.Header
        title="Несохранённые изменения"
        description="Есть несохранённые изменения. Если уйти, они будут потеряны."
      />
      <CommonDialog.Footer>
        <CommonButton type="button" className="w-36 text-xs" onClick={onStay}>
          Остаться
        </CommonButton>
        <CommonButton
          type="button"
          className="w-36 text-xs"
          onClick={onDiscard}
        >
          Не сохранять
        </CommonButton>
      </CommonDialog.Footer>
    </CommonDialog>
  );
}
