import { ConfirmActionDialog } from '@/shared/ui';
import { CommonButton } from '@/shared/ui/common';
import { FolderInput, Trash2, X } from 'lucide-react';

interface Props {
  selectedCount: number;
  moveMode: boolean;

  onStartMove: () => void;
  onBulkDelete: () => void;
  onClearSelection: () => void;
}

export function MediaSelectionToolbar({
  selectedCount,
  moveMode,
  onStartMove,
  onBulkDelete,
  onClearSelection,
}: Props) {
  if (selectedCount === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-4">
      <span className="whitespace-nowrap text-(--text-muted) text-sm">
        Выбрано: {selectedCount}
      </span>

      <div className="grid grid-cols-3 gap-2">
        <CommonButton
          type="button"
          onClick={onStartMove}
          disabled={moveMode}
          tooltip="Выберите папку назначения в левой панели"
        >
          <div className="flex items-center justify-center gap-1">
            <FolderInput size={14} />
            <span className="text-xs">Переместить</span>
          </div>
        </CommonButton>

        <ConfirmActionDialog
          title="Удалить выбранные файлы?"
          description={`Будет удалено файлов: ${selectedCount}. Все сценарии, в которых они используются, будут обновлены.`}
          confirmText="Удалить"
          onConfirm={onBulkDelete}
          trigger={
            <CommonButton type="button" disabled={moveMode}>
              <div className="flex items-center justify-center gap-1">
                <Trash2 size={14} />
                <span className="text-xs">Удалить</span>
              </div>
            </CommonButton>
          }
        />

        <CommonButton
          type="button"
          onClick={onClearSelection}
          disabled={moveMode}
        >
          <div className="flex items-center justify-center gap-1">
            <X size={14} />
            <span className="text-xs">Снять выделение</span>
          </div>
        </CommonButton>
      </div>
    </div>
  );
}
