import { useFindScheduleEventsByDate } from '@/entities/schedule';
import { hours } from '@/shared/constant/hours';
import { formatDateToMap } from '@/shared/lib/formatDateToMap';
import { getDaysOfWeekByDate } from '@/shared/lib/getDaysOfWeekByDate';
import { getOnlyDateStr } from '@/shared/lib/getOnlyDateStr';
import { getPositionPercentByDateTime } from '@/shared/lib/getPositionPercentByDateTime';
import { LoadingThreeDotsJumping } from '@/shared/ui/LoadingThreeDotsJumping';
import { PlayIcon } from '@radix-ui/react-icons';
import { useEffect, useState } from 'react';
import { TextMarquee } from '@/shared/ui/TextMarquee';

export function ScheduleWidget() {
  const todayDate = new Date();
  const [now, setNow] = useState(todayDate);
  const { data: events, isLoading } = useFindScheduleEventsByDate(
    getOnlyDateStr(todayDate),
  );

  const daysOfWeek = getDaysOfWeekByDate(now);
  const formatedDaysOfWeek = daysOfWeek.map((day) => formatDateToMap(day));
  const todayIndex = daysOfWeek.findIndex((d) => d.getDate() === now.getDate());

  const positionPercent = getPositionPercentByDateTime(
    now,
    parseInt(hours[0]),
    hours.length,
  );

  useEffect(() => {
    const intervalId = setInterval(() => {
      setNow(new Date());
    }, 60_000);
    return () => clearInterval(intervalId);
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <LoadingThreeDotsJumping />
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full flex-col">
      <h1 className="h-1/7 py-6 text-center font-semibold text-3xl">
        Расписание
      </h1>
      <div
        className="mx-auto flex w-full flex-1 border-t-2"
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
                <div className="font-semibold text-2xl">{d.dayMonth}</div>
                <div className="text-xl" style={{ color: 'var(--meta-text)' }}>
                  {d.weekDay}
                </div>
              </div>
            );
          })}
        </div>

        <div className="h-full w-px border-1 border-[var(--border)]" />

        <div className="w-3/4 p-10">
          <div className="relative h-full">
            <div
              className="-left-10 absolute z-20"
              style={{
                top: `${Math.min(100, Math.max(0, positionPercent))}%`,
              }}
            >
              <PlayIcon
                className="h-10 w-10"
                style={{ color: 'var(--text)' }}
              />
            </div>

            <div className="flex h-full flex-col">
              {hours.map((hour) => (
                <div
                  key={hour}
                  className="items-top flex flex-1 text-2xl"
                  style={{ color: 'var(--meta-text)' }}
                >
                  {hour}
                </div>
              ))}
            </div>

            {events?.map((event) => (
              <div
                key={event.id}
                className="absolute right-0 left-20 rounded-lg px-3 py-1 font-medium text-lg"
                style={{
                  top: `${getPositionPercentByDateTime(event.startTime, parseInt(hours[0]), hours.length)}%`,
                  backgroundColor: 'var(--card-bg)',
                  border: '1px solid var(--border)',
                }}
              >
                <TextMarquee text={`${event.startTime} | ${event.title}`} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div
        className="h-1/7 py-6 text-center font-medium text-3xl"
        style={{
          borderTop: '2px solid var(--border)',
          color: 'var(--text)',
        }}
      >
        Контент нижнего блока
      </div>
    </div>
  );
}
