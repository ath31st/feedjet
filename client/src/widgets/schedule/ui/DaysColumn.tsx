interface Day {
  weekDay: string;
  dayMonth: string;
}

interface DaysColumnProps {
  days: Day[];
  todayIndex: number;
  isEffectiveXl: boolean;
}

export function DaysColumn({
  days,
  todayIndex,
  isEffectiveXl,
}: DaysColumnProps) {
  return (
    <div
      className={`flex w-1/${isEffectiveXl ? 5 : 4} flex-col p-4 gap-${isEffectiveXl ? 4 : 10}`}
    >
      {days.map((d, idx) => {
        const isToday = idx === todayIndex;
        return (
          <div
            key={d.weekDay}
            className={`rounded-lg p-${isEffectiveXl ? 2 : 4} text-center`}
            style={{
              border: isToday
                ? '2px solid var(--border)'
                : '2px solid transparent',
              backgroundColor: isToday ? 'var(--card-bg)' : 'transparent',
            }}
          >
            <div className={`font-semibold text-${isEffectiveXl ? 1 : 2}xl`}>
              {d.dayMonth}
            </div>
            <div className="text-xl" style={{ color: 'var(--meta-text)' }}>
              {d.weekDay}
            </div>
          </div>
        );
      })}
    </div>
  );
}
