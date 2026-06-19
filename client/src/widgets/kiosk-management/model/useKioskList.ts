import {
  useDeleteKiosk,
  useGetAllKiosks,
  useKioskStore,
  useUpdateKiosk,
  type Kiosk,
  type UpdateKiosk,
} from '@/entities/kiosk';
import { useGetActiveHeartbeats } from '@/features/kiosk-heartbeat';
import { useState } from 'react';

export function useKioskList() {
  const [editKiosk, setEditKiosk] = useState<Kiosk | null>(null);
  const { currentKiosk, setDefaultKiosk } = useKioskStore();
  const { data: kiosks, isLoading } = useGetAllKiosks();
  const { data: heartbeats = [] } = useGetActiveHeartbeats();
  const deleteKiosk = useDeleteKiosk();
  const updateKiosk = useUpdateKiosk();

  const kiosksWithHeartbeats = kiosks?.map((kiosk) => ({
    ...kiosk,
    heartbeats: heartbeats.filter((h) => h.slug === kiosk.slug),
  }));

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
    kiosks: kiosksWithHeartbeats,
    isLoading,
    handleDelete,
    handleUpdate,
  };
}
