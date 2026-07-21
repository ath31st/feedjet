import type { ScheduleEvent } from '@shared/types/schedule.event';
import { formatCountdownRu } from '../lib/formatCountdownRu';
import { EmptyState } from './EmptyState';

interface NextEventPanelProps {
  events: ScheduleEvent[];
  nextEvent: ScheduleEvent | null;
  countdownSeconds: number;
  isEffectiveXl: boolean;
}

const EMPTY_DAY_MESSAGE = 'На текущую дату мероприятия не запланированы';

const NO_UPCOMING_MESSAGE =
  'На сегодня запланированных мероприятий не осталось';

export function NextEventPanel({
  events,
  nextEvent,
  countdownSeconds,
  isEffectiveXl,
}: NextEventPanelProps) {
  if (events.length === 0) {
    return (
      <EmptyState message={EMPTY_DAY_MESSAGE} isEffectiveXl={isEffectiveXl} />
    );
  }

  if (!nextEvent) {
    return (
      <EmptyState message={NO_UPCOMING_MESSAGE} isEffectiveXl={isEffectiveXl} />
    );
  }

  const title = nextEvent.title;

  if (isEffectiveXl) {
    return (
      <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-3 px-2 text-center">
        <div className="text-(--meta-text) text-3xl">Ближайшее мероприятие</div>

        <div className="w-full font-semibold text-(--card-text) text-2xl">
          {title}
        </div>

        <div className="text-(--meta-text) text-3xl">
          Начало в {nextEvent.startTime}
        </div>

        <div className="font-semibold text-(--card-text) text-2xl">
          До начала: {formatCountdownRu(countdownSeconds)}
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col justify-center gap-1 px-2 text-center">
      <div className="text-(--meta-text) text-2xl">Ближайшее мероприятие</div>

      <div className="w-full font-semibold text-(--card-text) text-xl leading-tight">
        {title}
      </div>

      <div className="text-(--meta-text) text-2xl">
        {nextEvent.startTime} · через {formatCountdownRu(countdownSeconds)}
      </div>
    </div>
  );
}
