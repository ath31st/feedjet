import { useState } from 'react';
import type { ScheduleEvent, NewScheduleEvent } from '@/entities/schedule';

type Mode = 'view' | 'create' | 'edit';

export function useManageScheduleSlotDialog(params: {
  onCreate: (data: NewScheduleEvent) => void;
  onUpdate: (id: number, data: NewScheduleEvent) => void;
}) {
  const { onCreate, onUpdate } = params;

  const [mode, setMode] = useState<Mode>('view');
  const [editing, setEditing] = useState<ScheduleEvent | null>(null);

  const toView = () => {
    setMode('view');
    setEditing(null);
  };

  const handleEdit = (event: ScheduleEvent) => {
    setEditing(event);
    setMode('edit');
  };

  const handleFormSubmit = (data: NewScheduleEvent) => {
    if (mode === 'edit' && editing) {
      onUpdate(editing.id, data);
    } else {
      onCreate(data);
    }
    toView();
  };

  return {
    mode,
    editing,
    setCreateMode: () => setMode('create'),
    handleEdit,
    handleFormSubmit,
    handleCancel: toView,
  };
}
