import { PlusIcon, SaveIcon } from 'lucide-react';
import { CommonButton } from '@/shared/ui/common';
import { ResetIcon } from '@radix-ui/react-icons';

interface HeaderProps {
  isDirty: boolean;
  onAdd: () => void;
  onSave: () => void;
  onReset: () => void;
}

export function Header({ isDirty, onAdd, onSave, onReset }: HeaderProps) {
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
        {isDirty && (
          <CommonButton
            onClick={onReset}
            type="button"
            tooltip="Отменить изменения"
          >
            <ResetIcon />
          </CommonButton>
        )}

        <CommonButton onClick={onAdd} type="button" tooltip="Добавить элемент">
          <PlusIcon size={15} />
        </CommonButton>

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
  );
}
