import { hours } from '@/shared/constant/hours';
import { formatDateToMap } from '@/shared/lib/formatDateToMap';
import { getDaysOfWeekByDate } from '@/shared/lib/getDaysOfWeekByDate';
import { getPositionPercentByDateTime } from '@/shared/lib/getPositionPercentByDateTime';
import { useIsXl } from '@/shared/lib/useIsXl';
import { LoadingThreeDotsJumping } from '@/shared/ui/LoadingThreeDotsJumping';
import { isRotate90 } from '@/shared/lib/parseRotateParam';
import { ScheduleHeader } from './ui/ScheduleHeader';
import { DaysColumn } from './ui/DaysColumn';
import { TimeGrid } from './ui/TimeGrid';
import { EventsList } from './ui/EventsList';
import { SideContent } from './ui/SideContent';
import { BottomContent } from './ui/BottomContent';
import { useScheduleWithTimer } from './model/useScheduleWithTimer';

interface ScheduleWidgetProps {
  rotate: number;
}

export function ScheduleWidget({ rotate }: ScheduleWidgetProps) {
  const { now, events, isLoading } = useScheduleWithTimer();
  const daysOfWeek = getDaysOfWeekByDate(now);
  const startHour = parseInt(hours[0]);
  const formatedDaysOfWeek = daysOfWeek.map(formatDateToMap);
  const todayIndex = daysOfWeek.findIndex((d) => d.getDate() === now.getDate());
  const positionPercent = getPositionPercentByDateTime(
    now,
    startHour,
    hours.length,
  );
  const isXl = useIsXl();
  const isEffectiveXl = isRotate90(rotate) ? !isXl : isXl;
  const effectiveSpeed = isRotate90(rotate) ? 1 : 50;

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <LoadingThreeDotsJumping />
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col">
      <ScheduleHeader isEffectiveXl={isEffectiveXl} />

      <div
        className="mx-auto flex w-full flex-1 border-t-2"
        style={{ borderColor: 'var(--border)' }}
      >
        <DaysColumn
          days={formatedDaysOfWeek}
          todayIndex={todayIndex}
          isEffectiveXl={isEffectiveXl}
        />
        <div className="h-full border border-[var(--border)]" />
        <div className={`w-full ${isEffectiveXl ? 'px-10 py-4' : 'p-12 py-8'}`}>
          <div className="relative h-full">
            <TimeGrid hours={hours} positionPercent={positionPercent} />
            <EventsList
              events={events ?? []}
              isEffectiveXl={isEffectiveXl}
              hoursStart={startHour}
              hoursCount={hours.length}
              effectiveSpeed={effectiveSpeed}
            />
          </div>
        </div>
        {isEffectiveXl && <SideContent />}
      </div>

      {!isEffectiveXl && <BottomContent />}
    </div>
  );
}
