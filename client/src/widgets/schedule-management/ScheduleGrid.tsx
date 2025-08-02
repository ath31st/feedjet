import { format, addDays, startOfWeek } from 'date-fns';
import { ru } from 'date-fns/locale';

interface ScheduleGridProps {
  weekStart?: Date;
}

export function ScheduleGrid({
  weekStart = startOfWeek(new Date(), { weekStartsOn: 1 }),
}: ScheduleGridProps) {
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const hours = Array.from({ length: 12 }, (_, i) => `${8 + i}:00`);

  return (
    <div className="w-full overflow-auto rounded-lg border border-[var(--border)]">
      <div className="grid grid-cols-[80px_repeat(7,1fr)]">
        <div className="h-10 border-[var(--border)] border-b bg-muted" />
        {days.map((date) => (
          <div
            key={date.toISOString()}
            className="flex h-10 flex-col items-center justify-center border-[var(--border)] border-b border-l bg-muted text-xs"
          >
            <span className="font-medium">
              {format(date, 'EE', { locale: ru })}
            </span>
            <span className="text-muted-foreground">
              {format(date, 'dd.MM')}
            </span>
          </div>
        ))}

        {hours.map((hour) => (
          <>
            <div
              key={`hour-${hour}`}
              className="flex h-16 items-start justify-center border-[var(--border)] border-t px-1 pt-1 text-xs"
            >
              {hour}
            </div>
            {days.map((date) => (
              <div
                key={`${date.toISOString()}-${hour}`}
                className="h-16 cursor-pointer border-[var(--border)] border-t border-l hover:bg-[var(--button-hover-bg)]"
              />
            ))}
          </>
        ))}
      </div>
    </div>
  );
}
