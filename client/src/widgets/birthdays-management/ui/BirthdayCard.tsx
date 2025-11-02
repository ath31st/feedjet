import type { Birthday } from '@shared/types/birthdays';

interface BirthdayCardProps {
  birthday: Birthday;
}

export function BirthdayCard({ birthday }: BirthdayCardProps) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-[var(--border)] bg-[var(--card-bg)] p-4">
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
      </div>
    </div>
  );
}
