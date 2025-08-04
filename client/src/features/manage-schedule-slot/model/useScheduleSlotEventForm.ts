import { useState } from 'react';
import type { NewScheduleEvent, ScheduleEvent } from '@/entities/schedule';

interface UseScheduleSlotEventFormProps {
  initialData?: Partial<ScheduleEvent>;
  date: string;
  time: string;
  onSubmit: (data: NewScheduleEvent) => void;
}

export function useScheduleSlotEventForm({
  initialData,
  date,
  time,
  onSubmit,
}: UseScheduleSlotEventFormProps) {
  const [title, setTitle] = useState(initialData?.title ?? '');
  const [description, setDescription] = useState(
    initialData?.description ?? '',
  );
  const [startTime, setStartTime] = useState(initialData?.startTime ?? time);

  const slotHour = time.split(':')[0];

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!title.trim()) return;

    onSubmit({
      title: title.trim(),
      description: description.trim() || undefined,
      date,
      startTime,
    });
  };

  return {
    title,
    setTitle,
    description,
    setDescription,
    startTime,
    setStartTime,
    handleSubmit,
    slotHour,
  };
}
