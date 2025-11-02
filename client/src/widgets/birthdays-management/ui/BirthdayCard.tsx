import { IconButton } from '@/shared/ui/common';
import { Cross1Icon } from '@radix-ui/react-icons';
import type { Birthday } from '@shared/types/birthdays';

interface BirthdayCardProps {
  birthday: Birthday;
  onDelete: (id: number) => void;
}

export function BirthdayCard({ birthday, onDelete }: BirthdayCardProps) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-[var(--border)] bg-[var(--card-bg)] p-2">
      <div className="truncate font-semibold text-[var(--text-primary)]">
        {birthday.fullName}
      </div>

      <div className="flex min-w-[220px] justify-end gap-4 text-[var(--text-meta)] text-sm">
        <span className="w-24 text-right">
          {new Date(birthday.birthDate).toLocaleDateString()}
        </span>
        {birthday.department && (
          <span className="w-34 truncate text-right">
            {birthday.department}
          </span>
        )}
        <IconButton
          onClick={() => onDelete(birthday.id)}
          tooltip="Удалить день рождения"
          icon={<Cross1Icon className="h-4 w-4 cursor-pointer" />}
        />
      </div>
    </div>
  );
}
