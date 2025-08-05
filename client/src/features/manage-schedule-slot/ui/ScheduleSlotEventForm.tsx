import { CommonButton } from '@/shared/ui/common/CommonButton';
import type { NewScheduleEvent, ScheduleEvent } from '@/entities/schedule';
import { useScheduleSlotEventForm } from '../model/useScheduleSlotEventForm';
import { CheckIcon, ResetIcon } from '@radix-ui/react-icons';

interface ScheduleSlotEventFormProps {
  initialData?: Partial<ScheduleEvent>;
  date: string;
  time: string;
  onSubmit: (data: NewScheduleEvent) => void;
  onCancel?: () => void;
}

export function ScheduleSlotEventForm({
  initialData,
  date,
  time,
  onSubmit,
  onCancel,
}: ScheduleSlotEventFormProps) {
  const {
    title,
    setTitle,
    description,
    setDescription,
    startTime,
    setStartTime,
    handleSubmit,
    slotHour,
  } = useScheduleSlotEventForm({ initialData, date, time, onSubmit });

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label
          htmlFor="event-time"
          className="mb-1 block text-muted-foreground text-xs"
        >
          Время
        </label>
        <input
          id="event-time"
          type="time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          min={`${slotHour}:00`}
          max={`${slotHour}:59`}
          step={60}
          className="w-full rounded border px-2 py-1 text-sm"
          required
        />
      </div>

      <div>
        <label
          htmlFor="title"
          className="mb-1 block text-muted-foreground text-xs"
        >
          Название
        </label>
        <textarea
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded border px-2 py-1 text-sm"
          required
          rows={4}
        />
      </div>

      <div>
        <label
          htmlFor="description"
          className="mb-1 block text-muted-foreground text-xs"
        >
          Описание (необязательно)
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full resize-none rounded border px-2 py-1 text-sm"
          rows={4}
        />
      </div>

      <div className="flex justify-end gap-2">
        {onCancel && (
          <CommonButton type="button" onClick={onCancel} disabled={false}>
            <ResetIcon />
          </CommonButton>
        )}
        <CommonButton
          type="submit"
          onClick={() => {
            handleSubmit;
          }}
          disabled={!title.trim()}
        >
          <CheckIcon />
        </CommonButton>
      </div>
    </form>
  );
}
