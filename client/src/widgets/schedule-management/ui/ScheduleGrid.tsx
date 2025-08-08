import { format, startOfWeek } from 'date-fns';
import { ru } from 'date-fns/locale';
import { useScheduleGrid } from '@/entities/schedule';
import { ManageScheduleSlotDialog } from '@/features/manage-schedule-slot';
import React from 'react';

interface ScheduleGridProps {
  weekStart?: Date;
}

export function ScheduleGrid({
  weekStart = startOfWeek(new Date(), { weekStartsOn: 1 }),
}: ScheduleGridProps) {
  const {
    days,
    hours,
    selectedSlot,
    setSelectedSlot,
    getEventsForSlot,
    handleCreate,
    handleUpdate,
    handleDelete,
  } = useScheduleGrid(weekStart);

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
