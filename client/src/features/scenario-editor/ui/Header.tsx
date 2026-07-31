import { Copy, PlusIcon, SaveIcon, Trash2 } from 'lucide-react';
import { CommonButton } from '@/shared/ui/common';
import { ConfirmActionDialog } from '@/shared/ui';
import { ResetIcon } from '@radix-ui/react-icons';

interface HeaderProps {
  isDirty: boolean;
  hasItems: boolean;
  isCopyMode: boolean;
  onAdd: () => void;
  onSave: () => void;
  onReset: () => void;
  onDeleteAll: () => void;
  onToggleCopyMode: () => void;
}

export function Header({
  isDirty,
  hasItems,
  isCopyMode,
  onAdd,
  onSave,
  onReset,
  onDeleteAll,
  onToggleCopyMode,
}: HeaderProps) {
  return (
    <div className="mb-2 flex items-center gap-3">
      <div className="flex items-center gap-2">
        <h1 className="font-semibold text-lg">Сценарий</h1>

        {isDirty && (
          <span className="animate-pulse rounded-full border border-(--border) bg-(--button-hover-bg) px-2 py-0.5 text-xs">
            не сохранен
          </span>
        )}
      </div>

      <div className="ml-auto flex items-center gap-2">
        <ConfirmActionDialog
          title="Удалить все элементы?"
          description="Все элементы будут удалены из черновика. Нажмите «Сохранить», чтобы применить изменения."
          confirmText="Удалить все"
          trigger={
            <CommonButton
              type="button"
              disabled={!hasItems}
              tooltip="Удалить все элементы"
            >
              <Trash2 size={15} />
            </CommonButton>
          }
          onConfirm={onDeleteAll}
        />

        <CommonButton onClick={onAdd} type="button" tooltip="Добавить элемент">
          <PlusIcon size={15} />
        </CommonButton>

        <CommonButton
          onClick={onToggleCopyMode}
          type="button"
          tooltip={
            isCopyMode
              ? 'Выберите киоск-источник (повторный клик — отмена)'
              : 'Скопировать сценарий из другого киоска'
          }
          className={isCopyMode ? 'bg-(--button-hover-bg)' : ''}
        >
          <Copy size={15} />
        </CommonButton>

        <div className="ml-2 flex items-center gap-2">
          {isDirty && (
            <CommonButton
              onClick={onReset}
              type="button"
              tooltip="Отменить изменения"
            >
              <ResetIcon />
            </CommonButton>
          )}

          <CommonButton
            type="button"
            onClick={onSave}
            disabled={!isDirty}
            tooltip="Сохранить сценарий"
          >
            <SaveIcon size={15} />
          </CommonButton>
        </div>
      </div>
    </div>
  );
}
