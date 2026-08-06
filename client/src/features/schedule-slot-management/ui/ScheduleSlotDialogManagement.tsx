import type { ScheduleEvent, NewScheduleEvent } from '@/entities/schedule';
import { ScheduleSlotEventForm } from './ScheduleSlotEventForm';
import { ScheduleSlotEventList } from './ScheduleSlotEventList';
import { CommonButton, CommonDialog } from '@/shared/ui/common';
import { format, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';
import { useScheduleSlotManagementDialog } from '../model/useScheduleSlotManagementDialog';
import { PlusIcon } from '@radix-ui/react-icons';

interface Props {
  date: string;
  startTime: string;
  events: ScheduleEvent[];
  open: boolean;
  onClose: () => void;
  onCreate: (data: NewScheduleEvent) => void;
  onUpdate: (id: number, data: NewScheduleEvent) => void;
  onDelete: (id: number) => void;
}

export function ScheduleSlotManagementDialog({
  date,
  startTime,
  events,
  open,
  onClose,
  onCreate,
  onUpdate,
  onDelete,
}: Props) {
  const {
    mode,
    editing,
    setCreateMode,
    handleEdit,
    handleFormSubmit,
    handleCancel,
  } = useScheduleSlotManagementDialog({ onCreate, onUpdate });

  return (
    <CommonDialog open={open} onClose={onClose} size="md">
      <CommonDialog.Header
        title={`${format(parseISO(date), 'd MMMM yyyy', { locale: ru })} ${startTime}`}
      />

      <CommonDialog.Body>
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
                onClick={setCreateMode}
                disabled={false}
              >
                <PlusIcon />
              </CommonButton>
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
      </CommonDialog.Body>
    </CommonDialog>
  );
}
