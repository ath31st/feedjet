import { getPositionPercentByDateTime } from '@/shared/lib/getPositionPercentByDateTime';
import { TextMarquee } from '@/shared/ui/TextMarquee';
import type { ScheduleEvent } from '@shared/types/schedule.event';

interface EventsListProps {
  events: ScheduleEvent[];
  isEffectiveXl: boolean;
  hoursStart: number;
  hoursCount: number;
  effectiveSpeed: number;
}

export function EventsList({
  events,
  isEffectiveXl,
  hoursStart,
  hoursCount,
  effectiveSpeed,
}: EventsListProps) {
  return (
    <>
      {events.map((event) => {
        const label = `${event.startTime} | ${event.title}`;

        const shouldScroll = label.length > (isEffectiveXl ? 50 : 30);
        return (
          <div
            key={event.id}
            className={`absolute right-0 left-26 rounded-lg px-3 py-1 font-medium text-${isEffectiveXl ? 'lg' : '1xl'}`}
            style={{
              top: `${getPositionPercentByDateTime(event.startTime, hoursStart, hoursCount)}%`,
              backgroundColor: 'var(--card-bg)',
              border: '1px solid var(--border)',
            }}
          >
            {shouldScroll ? (
              <TextMarquee speed={effectiveSpeed} text={label} />
            ) : (
              <span>{label}</span>
            )}
          </div>
        );
      })}
    </>
  );
}
