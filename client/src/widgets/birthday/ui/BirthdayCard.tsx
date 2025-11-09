import type { Birthday } from '@/entities/birthday';

interface BirthdayCardProps {
  birthday: Birthday;
  fontSizeXl?: number;
}

export function BirthdayCard({ birthday, fontSizeXl = 4 }: BirthdayCardProps) {
  return (
    <div
      className={`flex w-full flex-row justify-between text-${fontSizeXl}xl`}
    >
      <div className="">{birthday.fullName}</div>
      <div className="text-right text-[var(--meta-text)]">
        {new Date(birthday.birthDate).toLocaleDateString()}
      </div>
    </div>
  );
}
