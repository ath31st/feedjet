import { useMemo } from 'react';
import { getMonthMatrix } from '../lib/getMonthMatrix';

interface MonthCalendarProps {
  date?: Date;
  isEffectiveXl: boolean;
}

const WEEKDAY_LABELS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

export function MonthCalendar({
  date = new Date(),
  isEffectiveXl,
}: MonthCalendarProps) {
  const today = date.getDate();
  const year = date.getFullYear();
  const month = date.getMonth();
  const weeks = useMemo(
    () => getMonthMatrix(new Date(year, month, 1)),
    [year, month],
  );

  return (
    <div
      className={`flex h-full flex-1 flex-col justify-center ${
        isEffectiveXl ? 'p-14' : 'p-6'
      }`}
    >
      <div
        className={`grid grid-cols-7 text-center ${
          isEffectiveXl ? 'mb-6 gap-2 text-5xl' : 'mb-6 gap-1 text-4xl'
        }`}
      >
        {WEEKDAY_LABELS.map((label) => (
          <div key={label} className="font-medium">
            {label}
          </div>
        ))}
      </div>

      <div
        className={`grid flex-1 grid-cols-7 ${
          isEffectiveXl ? 'gap-2' : 'gap-1'
        }`}
      >
        {weeks.flat().map((day, index) => {
          if (day === null) {
            return (
              <div
                key={`empty-${
                  // biome-ignore lint/suspicious/noArrayIndexKey: simple index
                  index
                }`}
              />
            );
          }

          const isToday = day === today;

          return (
            <div
              key={day}
              className={`flex items-center justify-center rounded-lg font-semibold ${
                isEffectiveXl ? 'text-4xl' : 'text-3xl'
              }`}
              style={
                isToday
                  ? {
                      backgroundColor: 'var(--card-bg)',
                      border: '2px solid var(--border)',
                      color: 'var(--card-text)',
                    }
                  : {
                      color: 'var(--meta-text)',
                    }
              }
            >
              {day}
            </div>
          );
        })}
      </div>
    </div>
  );
}
