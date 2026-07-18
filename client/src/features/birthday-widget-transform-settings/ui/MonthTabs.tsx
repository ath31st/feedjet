import { MONTHS } from '@/entities/birthday-background';

export function MonthTabs({
  value,
  onChange,
  copyMode = false,
}: {
  value: number;
  onChange: (month: number) => void;
  copyMode?: boolean;
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
            className={`h-8 flex-1 cursor-pointer rounded-lg transition-all ${
              isActive ? 'bg-(--button-bg)' : 'bg-(--card-bg)'
            } hover:bg-(--button-hover-bg) ${
              copyMode
                ? 'border-(--button-hover-bg) border-2 border-dashed'
                : 'border-2 border-transparent'
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
