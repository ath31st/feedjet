import { useFindScheduleEventsByDate } from '@/entities/schedule';
import { hours } from '@/shared/constant/hours';
import { formatDateToMap } from '@/shared/lib/formatDateToMap';
import { getDaysOfWeekByDate } from '@/shared/lib/getDaysOfWeekByDate';
import { getOnlyDateStr } from '@/shared/lib/getOnlyDateStr';
import { getPositionPercentByDateTime } from '@/shared/lib/getPositionPercentByDateTime';
import { useIsXl } from '@/shared/lib/useIsXl';
import { LoadingThreeDotsJumping } from '@/shared/ui/LoadingThreeDotsJumping';
import { PlayIcon } from '@radix-ui/react-icons';
import { useEffect, useState } from 'react';
import { TextMarquee } from '@/shared/ui/TextMarquee';
import { isRotate90 } from '@/shared/lib/parseRotateParam';
import eagleUrl from '@/shared/assets/digital_eagle.svg';

interface ScheduleWidgetProps {
  rotate: number;
}

export function ScheduleWidget({ rotate }: ScheduleWidgetProps) {
  const todayDate = new Date();
  const [now, setNow] = useState(todayDate);
  const {
    data: events,
    isLoading,
    refetch: refetchEvents,
  } = useFindScheduleEventsByDate(getOnlyDateStr(todayDate));

  const daysOfWeek = getDaysOfWeekByDate(now);
  const formatedDaysOfWeek = daysOfWeek.map((day) => formatDateToMap(day));
  const todayIndex = daysOfWeek.findIndex((d) => d.getDate() === now.getDate());

  const positionPercent = getPositionPercentByDateTime(
    now,
    parseInt(hours[0]),
    hours.length,
  );

  const isXl = useIsXl();
  const isEffectiveXl = isRotate90(rotate) ? !isXl : isXl;
  const effectiveSpeed = isRotate90(rotate) ? 1 : 50;

  useEffect(() => {
    const intervalId = setInterval(() => {
      setNow(new Date());
      refetchEvents();
    }, 60_000);
    return () => clearInterval(intervalId);
  }, [refetchEvents]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <LoadingThreeDotsJumping />
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col">
      <div
        className={`flex h-1/${isEffectiveXl ? 5 : 7} items-center justify-center p-4`}
      >
        <img
          src={eagleUrl}
          alt="Eagle"
          className="h-full w-1/2 object-contain"
          style={{
            filter: 'drop-shadow(0 0 6px var(--border))',
          }}
        />
        <h1
          className={`w-${isEffectiveXl ? '4/5' : '2/3'} overflow-hidden text-center text-4xl uppercase`}
        >
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt
        </h1>
      </div>

      <div
        className="mx-auto flex w-full flex-1 border-t-2"
        style={{ borderColor: 'var(--border)' }}
      >
        <div
          className={`flex w-1/${isEffectiveXl ? 5 : 4} flex-col p-4 gap-${isEffectiveXl ? 4 : 10}`}
        >
          {formatedDaysOfWeek.map((d, idx) => {
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
                <div
                  className={`font-semibold text-${isEffectiveXl ? 1 : 2}xl`}
                >
                  {d.dayMonth}
                </div>
                <div className="text-xl" style={{ color: 'var(--meta-text)' }}>
                  {d.weekDay}
                </div>
              </div>
            );
          })}
        </div>

        <div className="h-full border border-[var(--border)]" />

        <div className={`w-full ${isEffectiveXl ? 'px-10 py-4' : 'p-12 py-8'}`}>
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
                  className={`items-top flex flex-1 text-2xl`}
                  style={{ color: 'var(--meta-text)' }}
                >
                  {hour}
                </div>
              ))}
            </div>

            {events?.map((event) => (
              <div
                key={event.id}
                className={`absolute right-0 left-20 rounded-lg px-3 py-1 font-medium text-${isEffectiveXl ? 'lg' : '1xl'}`}
                style={{
                  top: `${getPositionPercentByDateTime(event.startTime, parseInt(hours[0]), hours.length)}%`,
                  backgroundColor: 'var(--card-bg)',
                  border: '1px solid var(--border)',
                }}
              >
                <TextMarquee
                  speed={effectiveSpeed}
                  text={`${event.startTime} | ${event.title}`}
                />
              </div>
            ))}
          </div>
        </div>

        {isEffectiveXl && (
          <>
            <div className="h-full border border-[var(--border)]" />
            <div
              className="w-1/3 text-center font-medium text-3xl"
              style={{
                color: 'var(--text)',
              }}
            >
              Контент бокового блока
            </div>
          </>
        )}
      </div>

      {!isEffectiveXl && (
        <div
          className="h-1/7 text-center font-medium text-3xl"
          style={{
            borderTop: '2px solid var(--border)',
            color: 'var(--text)',
          }}
        >
          Контент нижнего блока
        </div>
      )}
    </div>
  );
}
