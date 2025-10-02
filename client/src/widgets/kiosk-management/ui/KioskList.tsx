import { LoadingThreeDotsJumping } from '@/shared/ui/LoadingThreeDotsJumping';
import { KioskCard } from './KioskCard';
import { ReloadKioskPageButton } from '@/features/reload-kiosk';
import { useKioskList } from '../model/useKioskList';

export function KioskList() {
  const { isLoading, kiosks, handleDelete } = useKioskList();

  if (isLoading) return <LoadingThreeDotsJumping />;
  if (!kiosks?.length) return <p>В базе данных нет киосков</p>;

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {kiosks.map((kiosk) => (
        <KioskCard
          key={kiosk.id}
          kiosk={kiosk}
          onDelete={handleDelete}
          actions={<ReloadKioskPageButton kioskId={kiosk.id} />}
        />
      ))}
    </div>
  );
}
