import {
  useDeleteKiosk,
  useGetAllKiosks,
  useKioskStore,
} from '@/entities/kiosk';

export function useKioskList() {
  const { currentKiosk, setCurrentKiosk } = useKioskStore();
  const { data: kiosks, isLoading } = useGetAllKiosks();
  const deleteKiosk = useDeleteKiosk();

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
    kiosks,
    isLoading,
    handleDelete,
  };
}
