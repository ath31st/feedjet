import { LoadingThreeDotsJumping } from '@/shared/ui/LoadingThreeDotsJumping';
import { KioskCard } from './KioskCard';
import { useKioskList } from '../model/useKioskList';
import { UpdateKioskDialog } from '@/features/kiosk-update';
import { CommonButton } from '@/shared/ui/common';
import { Pencil1Icon, TrashIcon } from '@radix-ui/react-icons';
import { ConfirmActionDialog } from '@/shared/ui';

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
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        {kiosks.map((kiosk) => (
          <KioskCard
            key={kiosk.id}
            kiosk={kiosk}
            actions={
              kiosk.slug === 'default' ? null : (
                <>
                  <ConfirmActionDialog
                    title="Удалить киоск?"
                    description={`Киоск «${kiosk.name}» будет удалён без возможности восстановления.`}
                    confirmText="Удалить"
                    onConfirm={() => handleDelete(kiosk.id)}
                    trigger={
                      <CommonButton type="button" tooltip="Удалить киоск">
                        <TrashIcon />
                      </CommonButton>
                    }
                  />

                  <CommonButton
                    onClick={() => setEditKiosk(kiosk)}
                    type="button"
                    tooltip="Редактировать киоск"
                  >
                    <Pencil1Icon />
                  </CommonButton>
                </>
              )
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
