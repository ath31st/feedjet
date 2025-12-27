import { MONTHS } from '@/entities/birthday-background';

export function MonthTabs({
  value,
  onChange,
}: {
  value: number;
  onChange: (month: number) => void;
}) {
  return (
    <div className="flex w-full gap-1">
      {Object.entries(MONTHS).map(([monthStr, label]) => {
        const month = Number(monthStr);
        const isActive = month === value;

        return (
          <button
            key={month}
            type="button"
            onClick={() => onChange(month)}
            className={`h-8 flex-1 cursor-pointer rounded-lg ${
              isActive ? 'bg-(--button-bg)' : 'bg-(--card-bg)'
            } hover:bg-(--button-hover-bg)`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
