import {
  useDeleteKiosk,
  useGetAllKiosks,
  useKioskStore,
} from '@/entities/kiosk';
import { useGetActiveHeartbeats } from '@/features/kiosk-heartbeat';

export function useKioskList() {
  const { currentKiosk, setCurrentKiosk } = useKioskStore();
  const { data: kiosks, isLoading } = useGetAllKiosks();
  const { data: heartbeats = [] } = useGetActiveHeartbeats();
  const deleteKiosk = useDeleteKiosk();

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
            setCurrentKiosk(null);
          }
        },
      },
    );
  };

  return {
    kiosks: kiosksWithHeartbeats,
    isLoading,
    handleDelete,
  };
}
