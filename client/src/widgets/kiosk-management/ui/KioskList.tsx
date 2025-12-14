import { LoadingThreeDotsJumping } from '@/shared/ui/LoadingThreeDotsJumping';
import { KioskCard } from './KioskCard';
import { ReloadKioskPageButton } from '@/features/reload-kiosk';
import { useKioskList } from '../model/useKioskList';
import { UpdateKioskDialog } from '@/features/kiosk-update';
import { CommonButton } from '@/shared/ui/common';
import { Pencil1Icon } from '@radix-ui/react-icons';

export function KioskList() {
  const {
    isLoading,
    kiosks,
    handleDelete,
    handleUpdate,
    setEditKiosk,
    editKiosk,
  } = useKioskList();

  if (isLoading) return <LoadingThreeDotsJumping />;
  if (!kiosks?.length) return <p>В базе данных нет киосков</p>;

  return (
    <>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {kiosks.map((kiosk) => (
          <KioskCard
            key={kiosk.id}
            kiosk={kiosk}
            onDelete={handleDelete}
            actions={
              <>
                <CommonButton
                  onClick={() => setEditKiosk(kiosk)}
                  type="button"
                  tooltip="Редактировать"
                >
                  <Pencil1Icon />
                </CommonButton>
                <ReloadKioskPageButton kioskId={kiosk.id} />
              </>
            }
          />
        ))}
      </div>

      {editKiosk && (
        <UpdateKioskDialog
          kiosk={editKiosk}
          open={true}
          onClose={() => setEditKiosk(null)}
          onUpdate={(data) => handleUpdate(editKiosk.id, data)}
        />
      )}
    </>
  );
}
