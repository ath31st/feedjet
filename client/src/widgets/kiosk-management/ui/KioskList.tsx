import { useDeleteKiosk, useGetAllKiosks } from '@/entities/kiosk';
import { LoadingThreeDotsJumping } from '@/shared/ui/LoadingThreeDotsJumping';
import { KioskCard } from './KioskCard';

export function KioskList() {
  const { data: kiosks, isLoading } = useGetAllKiosks();
  const deleteKiosk = useDeleteKiosk();

  const handleDelete = (id: number) => {
    deleteKiosk.mutate({ kioskId: id });
  };

  if (isLoading) return <LoadingThreeDotsJumping />;
  if (!kiosks?.length) return <p>В базе данных нет киосков</p>;

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {kiosks.map((kiosk) => (
        <KioskCard key={kiosk.id} kiosk={kiosk} onDelete={handleDelete} />
      ))}
    </div>
  );
}
