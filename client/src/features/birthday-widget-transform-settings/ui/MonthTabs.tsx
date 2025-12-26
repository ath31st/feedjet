const MONTHS = [
  'Янв',
  'Фев',
  'Мар',
  'Апр',
  'Май',
  'Июн',
  'Июл',
  'Авг',
  'Сен',
  'Окт',
  'Ноя',
  'Дек',
];

export function MonthTabs({
  value,
  onChange,
}: {
  value: number;
  onChange: (month: number) => void;
}) {
  return (
    <div className="flex w-full gap-1">
      {MONTHS.map((label, index) => {
        const month = index + 1;
        const isActive = month === value;

        return (
          <button
            type="button"
            key={month}
            onClick={() => onChange(month)}
            className={`flex-1 cursor-pointer ${isActive ? 'bg-(--button-bg)' : 'bg-(--card-bg)'} rounded-lg`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
