import { hours } from '@/shared/constant';
import {
  formatDateToMap,
  getDaysOfWeekByDate,
  getPositionPercentByDateTime,
  useIsXl,
  isRotate90,
} from '@/shared/lib';
import { LoadingThreeDotsJumping } from '@/shared/ui/LoadingThreeDotsJumping';
import { ScheduleHeader } from './ScheduleHeader';
import { DaysColumn } from './DaysColumn';
import { TimeGrid } from './TimeGrid';
import { EventsList } from './EventsList';
import { useScheduleWithTimer } from '../model/useScheduleWithTimer';
import { DigitalClock } from '@/shared/ui';
import { useBrandingConfigStore } from '@/entities/branding';
import { NextEventPanel } from './NextEventPanel';
import {
  getNextUpcomingEvent,
  getSecondsUntilEventStart,
} from '../lib/getNextUpcomingEvent';

interface ScheduleWidgetProps {
  rotate: number;
}

export function ScheduleWidget({ rotate }: ScheduleWidgetProps) {
  const headerTitle = useBrandingConfigStore(
    (s) => s.config?.scheduleHeaderTitle,
  );
  const organizationLogoUrl = useBrandingConfigStore((s) => s.logoUrl);
  const { now, events, isLoading } = useScheduleWithTimer();
  const daysOfWeek = getDaysOfWeekByDate(now);
  const startHour = parseInt(hours[0], 10);
  const formattedDaysOfWeek = daysOfWeek.map(formatDateToMap);
  const todayIndex = daysOfWeek.findIndex((d) => d.getDate() === now.getDate());
  const positionPercent = getPositionPercentByDateTime(
    now,
    startHour,
    hours.length,
  );
  const isXl = useIsXl();
  const isEffectiveXl = isRotate90(rotate) ? !isXl : isXl;
  const effectiveSpeed = isRotate90(rotate) ? 1 : 50;
  const fontXlSize = 8;

  const nextEvent = getNextUpcomingEvent(events, now);
  const countdownSeconds = nextEvent
    ? getSecondsUntilEventStart(nextEvent, now)
    : 0;

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <LoadingThreeDotsJumping />
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col">
      <ScheduleHeader
        isEffectiveXl={isEffectiveXl}
        title={headerTitle}
        logoUrl={organizationLogoUrl}
      />

      <div
        className="mx-auto flex w-full flex-1 border-t-4"
        style={{ borderColor: 'var(--border)' }}
      >
        <DaysColumn
          days={formattedDaysOfWeek}
          todayIndex={todayIndex}
          isEffectiveXl={isEffectiveXl}
        />
        <div className="h-full border-(--border) border-2" />
        <div className={`w-full ${isEffectiveXl ? 'px-10 py-4' : 'p-12 py-8'}`}>
          <div className="relative h-full">
            <TimeGrid hours={hours} positionPercent={positionPercent} />
            <EventsList
              events={events}
              isEffectiveXl={isEffectiveXl}
              hoursStart={startHour}
              hoursCount={hours.length}
              effectiveSpeed={effectiveSpeed}
            />
          </div>
        </div>
        {isEffectiveXl && (
          <>
            <div className="h-full border-(--border) border-2" />
            <div className="flex h-full w-1/2 min-w-0 flex-col gap-4 px-4 py-4">
              <DigitalClock fontXlSize={fontXlSize} />
              <NextEventPanel
                events={events}
                nextEvent={nextEvent}
                countdownSeconds={countdownSeconds}
                isEffectiveXl={isEffectiveXl}
              />
            </div>
          </>
        )}
      </div>

      {!isEffectiveXl && (
        <div className="flex h-1/7 min-h-0 flex-row items-stretch gap-4 border-(--border) border-t-4 px-4 py-2">
          <DigitalClock fontXlSize={fontXlSize} />
          <NextEventPanel
            events={events}
            nextEvent={nextEvent}
            countdownSeconds={countdownSeconds}
            isEffectiveXl={isEffectiveXl}
          />
        </div>
      )}
    </div>
  );
}
