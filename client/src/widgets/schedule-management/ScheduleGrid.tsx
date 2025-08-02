import {
  format,
  addDays,
  startOfWeek,
  parse,
  addHours,
  isWithinInterval,
  subSeconds,
} from 'date-fns';
import { ru } from 'date-fns/locale';
import { useState } from 'react';
import {
  useCreateScheduleEvent,
  useUpdateScheduleEvent,
  useDeleteScheduleEvent,
  useFindScheduleEventByDateRange,
} from '@/entities/schedule';
import { ManageScheduleSlotDialog } from '@/features/manage-schedule-slot';
import type {
  NewScheduleEvent,
  ScheduleEvent,
  UpdateScheduleEvent,
} from '@shared/types/schedule.event';
import React from 'react';

interface ScheduleGridProps {
  weekStart?: Date;
}

export function ScheduleGrid({
  weekStart = startOfWeek(new Date(), { weekStartsOn: 1 }),
}: ScheduleGridProps) {
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const hours = Array.from(
    { length: 12 },
    (_, i) => `${String(8 + i).padStart(2, '0')}:00`,
  );

  const [selectedSlot, setSelectedSlot] = useState<{
    date: string;
    startTime: string;
  } | null>(null);

  const { data: allEvents = [] } = useFindScheduleEventByDateRange(
    format(weekStart, 'yyyy-MM-dd'),
    format(addDays(weekStart, 7), 'yyyy-MM-dd'),
  );

  const createMutation = useCreateScheduleEvent();
  const updateMutation = useUpdateScheduleEvent();
  const deleteMutation = useDeleteScheduleEvent();

  const handleCreate = (data: NewScheduleEvent) => createMutation.mutate(data);
  const handleUpdate = (id: number, data: UpdateScheduleEvent) =>
    updateMutation.mutate({ id, data });
  const handleDelete = (id: number) => deleteMutation.mutate({ id });

  const TIME_FORMAT = 'HH:mm';

  const getEventsForSlot = (date: string, time: string): ScheduleEvent[] => {
    const slotStart = parse(time, TIME_FORMAT, new Date());
    const slotEnd = subSeconds(addHours(slotStart, 1), 1);

    return allEvents.filter((e) => {
      if (e.date !== date) return false;
      const eventTime = parse(e.startTime, TIME_FORMAT, new Date());
      return isWithinInterval(eventTime, { start: slotStart, end: slotEnd });
    });
  };

  return (
    <div className="w-full overflow-auto rounded-lg border border-[var(--border)]">
      <div className="grid grid-cols-[80px_repeat(7,1fr)]">
        <div className="h-10 border-[var(--border)] border-b bg-muted" />
        {days.map((date) => (
          <div
            key={date.toISOString()}
            className="flex h-10 flex-col items-center justify-center border-[var(--border)] border-b border-l bg-muted text-xs"
          >
            <span className="font-medium">
              {format(date, 'EE', { locale: ru })}
            </span>
            <span className="text-muted-foreground">
              {format(date, 'dd.MM')}
            </span>
          </div>
        ))}

        {hours.map((hour) => (
          <React.Fragment key={`hour-row-${hour}`}>
            <div
              key={`hour-${hour}`}
              className="flex h-16 items-start justify-center border-[var(--border)] border-t px-1 pt-1 text-xs"
            >
              {hour}
            </div>
            {days.map((date) => {
              const dateStr = format(date, 'yyyy-MM-dd');
              const slotEvents = getEventsForSlot(dateStr, hour);

              return (
                <button
                  key={`${dateStr}-${hour}`}
                  type="button"
                  onClick={() =>
                    setSelectedSlot({ date: dateStr, startTime: hour })
                  }
                  className="flex h-16 w-full flex-col overflow-hidden border-[var(--border)] border-t border-l p-1 text-left hover:bg-[var(--button-hover-bg)] focus:outline-none focus-visible:ring focus-visible:ring-primary"
                  aria-label={`Ячейка расписания на ${dateStr} в ${hour}`}
                >
                  {slotEvents.slice(0, 3).map((event) => (
                    <div
                      key={event.id}
                      className="w-full overflow-hidden truncate whitespace-nowrap text-foreground text-xs"
                      title={event.title}
                    >
                      {event.title}
                    </div>
                  ))}
                </button>
              );
            })}
          </React.Fragment>
        ))}
      </div>

      {selectedSlot && (
        <ManageScheduleSlotDialog
          date={selectedSlot.date}
          startTime={selectedSlot.startTime}
          events={getEventsForSlot(selectedSlot.date, selectedSlot.startTime)}
          open={!!selectedSlot}
          onClose={() => setSelectedSlot(null)}
          onCreate={handleCreate}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
