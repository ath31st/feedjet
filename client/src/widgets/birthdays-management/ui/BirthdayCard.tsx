import { IconButton } from '@/shared/ui/common';
import {
  Cross1Icon,
  Pencil1Icon,
  CheckIcon,
  ResetIcon,
} from '@radix-ui/react-icons';
import type { Birthday } from '@/entities/birthday';

interface BirthdayCardProps {
  birthday: Birthday;

  isEditing: boolean;
  fullNameDraft: string;

  onChangeFullName: (value: string) => void;
  onEdit: (id: number, fullName: string) => void;
  onSave: () => void;
  onCancel: () => void;
  onDelete: (id: number) => void;
}

export function BirthdayCard({
  birthday,
  isEditing,
  fullNameDraft,
  onChangeFullName,
  onEdit,
  onSave,
  onCancel,
  onDelete,
}: BirthdayCardProps) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-(--border) bg-(--card-bg) p-2">
      <div className="min-w-0 flex-1 font-semibold text-(--text-primary)">
        {isEditing ? (
          <input
            value={fullNameDraft}
            onChange={(e) => onChangeFullName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onSave()}
            className="w-[max-content] rounded-lg border border-(--border) bg-transparent px-2 py-1 ring-(--border) focus:outline-none"
            style={{ width: `${Math.max(fullNameDraft.length, 1) + 2}ch` }}
          />
        ) : (
          <div className="truncate">{birthday.fullName}</div>
        )}
      </div>

      <div className="flex min-w-[220px] justify-end gap-4 text-(--text-meta) text-sm">
        <span className="w-24 text-right">
          {new Date(birthday.birthDate).toLocaleDateString()}
        </span>

        <span className="w-34 truncate text-right">{birthday.department}</span>

        {isEditing ? (
          <IconButton
            onClick={onSave}
            tooltip="Сохранить изменения"
            icon={<CheckIcon className="h-4 w-4 cursor-pointer" />}
          />
        ) : (
          <IconButton
            onClick={() => onEdit(birthday.id, birthday.fullName)}
            tooltip="Изменить ФИО"
            icon={<Pencil1Icon className="h-4 w-4 cursor-pointer" />}
          />
        )}

        {isEditing ? (
          <IconButton
            onClick={onCancel}
            tooltip="Отменить редактирование"
            icon={<ResetIcon className="h-4 w-4 cursor-pointer" />}
          />
        ) : (
          <IconButton
            onClick={() => onDelete(birthday.id)}
            tooltip="Удалить день рождения"
            icon={<Cross1Icon className="h-4 w-4 cursor-pointer" />}
          />
        )}
      </div>
    </div>
  );
}
