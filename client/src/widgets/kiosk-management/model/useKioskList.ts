import {
  useDeleteKiosk,
  useGetAllKiosks,
  useKioskStore,
  useUpdateKiosk,
  type Kiosk,
  type UpdateKiosk,
} from '@/entities/kiosk';
import { useState } from 'react';

export function useKioskList() {
  const [editKiosk, setEditKiosk] = useState<Kiosk | null>(null);
  const { currentKiosk, setDefaultKiosk } = useKioskStore();
  const { data: kiosks, isLoading } = useGetAllKiosks();
  const deleteKiosk = useDeleteKiosk();
  const updateKiosk = useUpdateKiosk();

  const handleDelete = (id: number) => {
    deleteKiosk.mutate(
      { kioskId: id },
      {
        onSuccess: () => {
          if (currentKiosk?.id === id) {
            setDefaultKiosk();
          }
        },
      },
    );
  };

  const handleUpdate = (kioskId: number, kiosk: UpdateKiosk) => {
    updateKiosk.mutate({
      kioskId,
      data: kiosk,
    });
  };

  return {
    editKiosk,
    setEditKiosk,
    kiosks,
    isLoading,
    handleDelete,
    handleUpdate,
  };
}
