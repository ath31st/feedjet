import type { ScheduleEvent } from '@/entities/schedule';
import { IconButton } from '@/shared/ui/common';
import { Cross1Icon, Pencil1Icon } from '@radix-ui/react-icons';

interface ScheduleSlotEventListProps {
  events: ScheduleEvent[];
  onEdit?: (event: ScheduleEvent) => void;
  onDelete?: (eventId: number) => void;
}

export function ScheduleSlotEventList({
  events,
  onEdit,
  onDelete,
}: ScheduleSlotEventListProps) {
  if (!events.length) {
    return <p className="text-muted-foreground text-sm">Нет событий</p>;
  }

  return (
    <ul className="space-y-2">
      {events.map((event) => (
        <li
          key={event.id}
          className="flex items-start justify-between gap-1 rounded-md border border-[var(--border)] bg-muted px-3 py-2 text-sm"
        >
          <div className="flex flex-1 items-start gap-1">
            <span className="w-10 text-muted-foreground text-xs">
              {event.startTime}
            </span>
            <div className="flex-1">
              <p className="font-medium">{event.title}</p>
              {event.description && (
                <p className="text-muted-foreground text-xs">
                  {event.description}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1">
            {onEdit && (
              <IconButton
                onClick={() => onEdit(event)}
                ariaLabel="Редактировать событие"
                tooltip="Редактировать событие"
                icon={<Pencil1Icon className="h-4 w-4 cursor-pointer" />}
              />
            )}
            {onDelete && (
              <IconButton
                onClick={() => onDelete(event.id)}
                ariaLabel="Удалить событие"
                tooltip="Удалить событие"
                icon={<Cross1Icon className="h-4 w-4 cursor-pointer" />}
              />
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
