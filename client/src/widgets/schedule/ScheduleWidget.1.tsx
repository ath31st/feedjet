import { useFindScheduleEventsByDate } from '@/entities/schedule';
import { hours } from '@/shared/constant/hours';
import { formatDateToMap } from '@/shared/lib/formatDateToMap';
import { getDaysOfWeekByDate } from '@/shared/lib/getDaysOfWeekByDate';
import { getOnlyDateStr } from '@/shared/lib/getOnlyDateStr';
import { PlayIcon } from '@radix-ui/react-icons';
import { useState, useEffect } from 'react';

export function ScheduleWidget() {
  const todayDate = new Date();
  const [now, setNow] = useState(todayDate);
  const { data, isLoading, isError, error } = useFindScheduleEventsByDate(
    getOnlyDateStr(todayDate),
  );

  const daysOfWeek = getDaysOfWeekByDate(now);
  const formatedDaysOfWeek = daysOfWeek.map((day) => formatDateToMap(day));
  const todayIndex = daysOfWeek.findIndex((d) => d.getDate() === now.getDate());

  const nowHours = now.getHours();
  const nowMinutes = now.getMinutes();
  const positionPercent =
    (((nowHours - 8) * 60 + nowMinutes) / ((20 - 8) * 60)) * 100;

  useEffect(() => {
    const intervalId = setInterval(() => {
      setNow(new Date());
    }, 60000);

    return () => clearInterval(intervalId);
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center font-medium text-xl">
        Загрузка расписания...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-screen items-center justify-center font-medium text-red-600">
        Ошибка загрузки расписания:{' '}
        {error instanceof Error ? error.message : 'Unknown error'}
      </div>
    );
  }

  return (
    <div className="h-screen w-full" style={{ color: 'var(--text)' }}>
      <h1 className="h-1/7 py-6 text-center font-semibold text-3xl">
        Расписание
      </h1>
      <div
        className="mx-auto flex h-[calc(100%-4.5rem)] w-full max-w-6xl border-t-2"
        style={{ borderColor: 'var(--border)' }}
      >
        <div className="flex w-1/4 flex-col gap-10 p-4">
          {formatedDaysOfWeek.map((d, idx) => {
            const isToday = idx === todayIndex;
            return (
              <div
                key={d.weekDay}
                className="rounded-lg p-4 text-center"
                style={{
                  border: isToday
                    ? '2px solid var(--border)'
                    : '2px solid transparent',
                  backgroundColor: isToday ? 'var(--card-bg)' : 'transparent',
                }}
              >
                <div className="font-semibold text-xl">{d.dayMonth}</div>
                <div className="text-lg" style={{ color: 'var(--meta-text)' }}>
                  {d.weekDay}
                </div>
              </div>
            );
          })}
        </div>

        <div className="h-full w-px border-1 border-[var(--border)]" />

        <div className="w-1/4 p-6">
          <div className="flex flex-col gap-16">
            <div className="relative h-full">
              <div
                className="-translate-y-1/2 -left-6 absolute"
                style={{
                  top: `${positionPercent}%`,
                }}
              >
                <PlayIcon
                  className="h-8 w-8"
                  style={{ color: 'var(--text)' }}
                />
              </div>

              <div className="flex flex-col gap-16">
                {hours.map((hour) => (
                  <div
                    key={hour}
                    className="text-xl"
                    style={{ color: 'var(--meta-text)' }}
                  >
                    {hour}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
