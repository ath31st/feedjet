import * as Dialog from '@radix-ui/react-dialog';
import { useState } from 'react';
import type {
  ScheduleEvent,
  NewScheduleEvent,
} from '@shared/types/schedule.event';
import { ScheduleSlotEventForm } from './ScheduleSlotEventForm';
import { ScheduleSlotEventList } from './ScheduleSlotEventList';
import { CommonButton } from '@/shared/ui/common/CommonButton';
import { format, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';

interface ManageScheduleSlotDialogProps {
  date: string;
  startTime: string;
  events: ScheduleEvent[];
  open: boolean;
  onClose: () => void;
  onCreate: (data: NewScheduleEvent) => void;
  onUpdate: (id: number, data: NewScheduleEvent) => void;
  onDelete: (id: number) => void;
}

export function ManageScheduleSlotDialog({
  date,
  startTime,
  events,
  open,
  onClose,
  onCreate,
  onUpdate,
  onDelete,
}: ManageScheduleSlotDialogProps) {
  const [mode, setMode] = useState<'view' | 'create' | 'edit'>('view');
  const [editing, setEditing] = useState<ScheduleEvent | null>(null);

  const handleEdit = (event: ScheduleEvent) => {
    setEditing(event);
    setMode('edit');
  };

  const handleFormSubmit = (data: NewScheduleEvent) => {
    if (mode === 'edit' && editing) {
      onUpdate(editing.id, data);
    } else {
      console.log(data);
      onCreate(data);
    }
    setMode('view');
    setEditing(null);
  };

  const handleCancel = () => {
    setMode('view');
    setEditing(null);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="-translate-x-1/2 -translate-y-1/2 fixed top-1/2 left-1/2 w-[500px] max-w-[90vw] rounded-md bg-[var(--card-bg)] p-5 shadow-xl">
          <Dialog.Title className="mb-4 font-semibold text-lg">
            {format(parseISO(date), 'd MMMM yyyy', { locale: ru })} {startTime}
          </Dialog.Title>

          {mode === 'view' && (
            <>
              <ScheduleSlotEventList
                events={events}
                onEdit={handleEdit}
                onDelete={onDelete}
              />
              <div className="mt-4 flex justify-end">
                <CommonButton
                  type="button"
                  text="+ Создать событие"
                  onClick={() => setMode('create')}
                  disabled={false}
                />
              </div>
            </>
          )}

          {(mode === 'create' || mode === 'edit') && (
            <ScheduleSlotEventForm
              date={date}
              time={startTime}
              initialData={editing || { date, startTime }}
              onSubmit={handleFormSubmit}
              onCancel={handleCancel}
            />
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
