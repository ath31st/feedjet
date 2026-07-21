import type { ScheduleEvent } from '@shared/types/schedule.event';

function parseEventStart(referenceDate: Date, startTime: string): Date {
  const [hours, minutes] = startTime.split(':').map(Number);
  const eventStart = new Date(referenceDate);
  eventStart.setHours(hours, minutes, 0, 0);
  return eventStart;
}

export function getNextUpcomingEvent(
  events: ScheduleEvent[],
  now: Date,
): ScheduleEvent | null {
  const upcoming = events
    .map((event) => ({
      event,
      start: parseEventStart(now, event.startTime),
    }))
    .filter(({ start }) => start > now)
    .sort((a, b) => a.start.getTime() - b.start.getTime());

  return upcoming[0]?.event ?? null;
}

export function getSecondsUntilEventStart(
  event: ScheduleEvent,
  now: Date,
): number {
  const start = parseEventStart(now, event.startTime);
  return Math.max(0, Math.floor((start.getTime() - now.getTime()) / 1000));
}
