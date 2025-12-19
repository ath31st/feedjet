import { LoadingThreeDotsJumping } from '@/shared/ui/LoadingThreeDotsJumping';
import { KioskCard } from './KioskCard';
import { ReloadKioskPageButton } from '@/features/reload-kiosk';
import { useKioskList } from '../model/useKioskList';
import { UpdateKioskDialog } from '@/features/kiosk-update';
import { CommonButton } from '@/shared/ui/common';
import { Link2Icon, Pencil1Icon, Pencil2Icon } from '@radix-ui/react-icons';
import { IntegrationUpdateDialog } from '@/features/integration-update';
import { IntegrationCreateDialog } from '@/features/integration-create-update';

export function KioskList() {
  const {
    isLoading,
    kiosks,
    handleDelete,
    handleUpdate,
    setEditKiosk,
    editKiosk,
    createIntegrationFor,
    setCreateIntegrationFor,
    editIntegration,
    setEditIntegration,
    handleCreateIntegration,
    handleUpdateIntegration,
    handleDeleteIntegration,
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
                {kiosk.integration ? (
                  <CommonButton
                    onClick={() => setEditIntegration(kiosk.integration)}
                    type="button"
                    tooltip="Редактировать интеграцию"
                  >
                    <Pencil2Icon />
                  </CommonButton>
                ) : (
                  <CommonButton
                    onClick={() => setCreateIntegrationFor(kiosk)}
                    type="button"
                    tooltip="Добавить интеграцию"
                  >
                    <Link2Icon />
                  </CommonButton>
                )}

                <CommonButton
                  onClick={() => setEditKiosk(kiosk)}
                  type="button"
                  tooltip="Редактировать киоск"
                >
                  <Pencil1Icon />
                </CommonButton>
                <ReloadKioskPageButton kioskId={kiosk.id} />
              </>
            }
          />
        ))}
      </div>

      {createIntegrationFor && (
        <IntegrationCreateDialog
          open={true}
          onClose={() => setCreateIntegrationFor(null)}
          onCreate={(data) =>
            handleCreateIntegration(createIntegrationFor.id, data)
          }
        />
      )}

      {editIntegration && (
        <IntegrationUpdateDialog
          integration={editIntegration}
          open={true}
          onClose={() => setEditIntegration(null)}
          onUpdate={(data) =>
            handleUpdateIntegration(editIntegration.kioskId, data)
          }
          onDelete={(kioskId) => handleDeleteIntegration(kioskId)}
        />
      )}

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
