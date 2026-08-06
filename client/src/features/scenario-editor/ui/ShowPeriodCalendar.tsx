import { useMemo } from 'react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { fmtLocalDateYmd } from '@/shared/lib/formatters';
import { getMonthMatrix } from '../lib/getMonthMatrix';

const WEEKDAY_LABELS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

interface ShowPeriodCalendarProps {
  viewMonth: Date;
  onViewMonthChange: (date: Date) => void;
  rangeStart: string | null;
  rangeEnd: string | null;
  onDayClick: (day: number) => void;
}

function isBetweenYmd(dayYmd: string, start: string, end: string): boolean {
  return start <= dayYmd && dayYmd <= end;
}

export function ShowPeriodCalendar({
  viewMonth,
  onViewMonthChange,
  rangeStart,
  rangeEnd,
  onDayClick,
}: ShowPeriodCalendarProps) {
  const todayYmd = fmtLocalDateYmd();
  const year = viewMonth.getFullYear();
  const month = viewMonth.getMonth();
  const weeks = useMemo(
    () => getMonthMatrix(new Date(year, month, 1)),
    [year, month],
  );

  const effectiveEnd = rangeEnd ?? rangeStart;

  return (
    <div className="rounded-lg border border-(--border)/40 p-3">
      <div className="mb-3 flex items-center justify-between">
        <button
          type="button"
          className="cursor-pointer rounded-md p-1 text-(--meta-text) hover:bg-(--border)/10"
          onClick={() => onViewMonthChange(new Date(year, month - 1, 1))}
        >
          <ChevronLeft size={18} />
        </button>
        <span className="font-medium text-sm capitalize">
          {format(new Date(year, month, 1), 'LLLL yyyy', { locale: ru })}
        </span>
        <button
          type="button"
          className="cursor-pointer rounded-md p-1 text-(--meta-text) hover:bg-(--border)/10"
          onClick={() => onViewMonthChange(new Date(year, month + 1, 1))}
        >
          <ChevronRight size={18} />
        </button>
      </div>

      <div className="mb-1 grid grid-cols-7 gap-1 text-center text-(--meta-text) text-xs">
        {WEEKDAY_LABELS.map((label) => (
          <div key={label}>{label}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {weeks.flat().map((day, index) => {
          if (day == null) {
            return (
              <div
                key={`empty-${
                  // biome-ignore lint/suspicious/noArrayIndexKey: calendar padding
                  index
                }`}
              />
            );
          }

          const dayYmd = fmtLocalDateYmd(new Date(year, month, day));
          const isToday = dayYmd === todayYmd;
          const isStart = rangeStart != null && dayYmd === rangeStart;
          const isEnd = rangeEnd != null && dayYmd === rangeEnd;
          const inRange =
            rangeStart != null &&
            effectiveEnd != null &&
            isBetweenYmd(dayYmd, rangeStart, effectiveEnd);
          const isAnchor = isStart || isEnd;

          let cellClass =
            'flex h-9 cursor-pointer items-center justify-center rounded-md text-sm transition-colors ';

          if (isAnchor) {
            cellClass += 'bg-(--button-bg) font-semibold text-(--button-text)';
          } else if (inRange) {
            cellClass += 'bg-(--button-bg)/25 text-(--text)';
          } else {
            cellClass += 'text-(--text) hover:bg-(--border)/10';
          }

          if (isToday && !isAnchor) {
            cellClass += ' ring-1 ring-(--border)';
          }

          return (
            <button
              key={dayYmd}
              type="button"
              className={cellClass}
              onClick={() => onDayClick(day)}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}
