import { ConfirmActionDialog } from '@/shared/ui';
import { CommonButton } from '@/shared/ui/common';
import { FolderInput, Plus, Trash2, X } from 'lucide-react';

type Mode = 'manage' | 'select';

interface Props {
  selectedCount: number;
  mode: Mode;
  moveMode: boolean;

  onStartMove?: () => void;
  onBulkDelete?: () => void;
  onClearSelection: () => void;
  onAddToScenario?: () => void;
}

export function MediaSelectionToolbar({
  selectedCount,
  mode,
  moveMode,
  onStartMove,
  onBulkDelete,
  onClearSelection,
  onAddToScenario,
}: Props) {
  if (selectedCount === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-4">
      <span className="whitespace-nowrap text-(--text-muted) text-sm">
        Выбрано: {selectedCount}
      </span>

      <div className={`grid grid-cols-${mode === 'manage' ? 3 : 2} gap-2`}>
        {mode === 'manage' && onStartMove && onBulkDelete && (
          <>
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
          </>
        )}

        {mode === 'select' && (
          <>
            <CommonButton type="button" onClick={onAddToScenario}>
              <div className="flex items-center justify-center gap-1">
                <Plus size={14} />
                <span className="text-xs">Добавить в сценарий</span>
              </div>
            </CommonButton>

            <CommonButton type="button" onClick={onClearSelection}>
              <div className="flex items-center justify-center gap-1">
                <X size={14} />
                <span className="text-xs">Снять выделение</span>
              </div>
            </CommonButton>
          </>
        )}
      </div>
    </div>
  );
}
