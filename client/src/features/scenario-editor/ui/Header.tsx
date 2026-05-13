/** biome-ignore-all lint/a11y: disable all a11y rules */
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
      <h1 className="font-semibold text-lg">
        Сценарий
        {isDirty && (
          <span
            className="ml-1 inline-block h-2 w-2 rounded-full bg-amber-400"
            title="Несохранённые изменения"
          />
        )}
      </h1>

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
