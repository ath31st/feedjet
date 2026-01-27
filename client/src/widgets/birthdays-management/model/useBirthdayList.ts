import {
  useDeleteBirthday,
  useGetAllBirthdays,
  useUpdateBirthday,
} from '@/entities/birthday';
import { useState } from 'react';

export function useBirthdayList() {
  const { isLoading, data: birthdays } = useGetAllBirthdays();
  const deleteBirthday = useDeleteBirthday();
  const updateBirthday = useUpdateBirthday();

  const [editingId, setEditingId] = useState<number | null>(null);
  const [fullNameDraft, setFullNameDraft] = useState('');

  const handleDelete = (id: number) => {
    deleteBirthday.mutate({ id });
  };

  const startEdit = (id: number, initialFullName: string) => {
    setEditingId(id);
    setFullNameDraft(initialFullName);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFullNameDraft('');
  };

  const saveEdit = () => {
    if (editingId === null) return;

    const nextFullName = fullNameDraft.trim();
    if (!nextFullName) {
      cancelEdit();
      return;
    }

    const current = birthdays?.find((b) => b.id === editingId);
    if (!current || current.fullName === nextFullName) {
      cancelEdit();
      return;
    }

    updateBirthday.mutate({ id: editingId, fullName: nextFullName });

    cancelEdit();
  };

  return {
    isLoading,
    birthdays,

    handleDelete,

    editingId,
    fullNameDraft,
    setFullNameDraft,

    startEdit,
    cancelEdit,
    saveEdit,
  };
}
