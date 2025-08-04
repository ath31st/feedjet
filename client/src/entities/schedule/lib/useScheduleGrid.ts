import { useState } from 'react';
import {
  useCreateScheduleEvent,
  useUpdateScheduleEvent,
  useDeleteScheduleEvent,
  useFindScheduleEventByDateRange,
} from '../api/useSchedule';
import {
  addDays,
  format,
  parse,
  addHours,
  subSeconds,
  isWithinInterval,
} from 'date-fns';
import type { NewScheduleEvent, UpdateScheduleEvent } from '..';

export function useScheduleGrid(weekStart: Date) {
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const hours = Array.from(
    { length: 12 },
    (_, i) => `${String(8 + i).padStart(2, '0')}:00`,
  );

  const [selectedSlot, setSelectedSlot] = useState<{
    date: string;
    startTime: string;
  } | null>(null);

  const DATE_FORMAT = 'yyyy-MM-dd';

  const { data: allEvents = [] } = useFindScheduleEventByDateRange(
    format(weekStart, DATE_FORMAT),
    format(addDays(weekStart, 7), DATE_FORMAT),
  );

  const createMutation = useCreateScheduleEvent();
  const updateMutation = useUpdateScheduleEvent();
  const deleteMutation = useDeleteScheduleEvent();

  const handleCreate = (data: NewScheduleEvent) => createMutation.mutate(data);
  const handleUpdate = (id: number, data: UpdateScheduleEvent) =>
    updateMutation.mutate({ id, data });
  const handleDelete = (id: number) => deleteMutation.mutate({ id });

  const TIME_FORMAT = 'HH:mm';

  const getEventsForSlot = (date: string, time: string) => {
    const slotStart = parse(time, TIME_FORMAT, new Date());
    const slotEnd = subSeconds(addHours(slotStart, 1), 1);
    return allEvents.filter(
      (e) =>
        e.date === date &&
        isWithinInterval(parse(e.startTime, TIME_FORMAT, new Date()), {
          start: slotStart,
          end: slotEnd,
        }),
    );
  };

  return {
    days,
    hours,
    selectedSlot,
    setSelectedSlot,
    getEventsForSlot,
    handleCreate,
    handleUpdate,
    handleDelete,
  };
}
