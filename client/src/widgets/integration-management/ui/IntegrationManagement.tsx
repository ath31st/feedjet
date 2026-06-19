import { SettingsCard } from '@/shared/ui';
import { IntegrationList } from './IntegrationList';
import { IntegrationCreateDialog } from '@/features/integration-create-update';
import { IntegrationUpdateDialog } from '@/features/integration-update';
import { useIntegrationWidget } from '../model/useIntegrationWidget';
import { CommonButton } from '@/shared/ui/common';
import { Link2Icon } from 'lucide-react';
import { useState } from 'react';

export function IntegrationManagement() {
  const {
    editIntegration,
    setEditIntegration,
    handleCreateIntegration,
    handleUpdateIntegration,
  } = useIntegrationWidget();
  const [openCreateDialog, setOpenCreateDialog] = useState(false);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex w-full flex-row gap-6">
        <SettingsCard title="Создание интеграции" className="w-full md:w-2/5">
          <div>
            {/* <CommonButton
                onClick={() => setEditIntegration(kiosk.integration)}
                type="button"
                tooltip="Редактировать интеграцию"
              >
                <Pencil2Icon />
              </CommonButton> */}

            <CommonButton
              onClick={() => setOpenCreateDialog(true)}
              type="button"
              tooltip="Добавить интеграцию"
            >
              <Link2Icon />
            </CommonButton>
          </div>
        </SettingsCard>

        <SettingsCard
          title="Устройства без интеграции"
          className="w-full md:w-3/5"
        >
          <div />
        </SettingsCard>
      </div>
      <SettingsCard title="Список интеграций" className="w-full">
        <IntegrationList />
      </SettingsCard>

      {openCreateDialog && (
        <IntegrationCreateDialog
          open={true}
          onClose={() => setOpenCreateDialog(false)}
          onCreate={(data) => handleCreateIntegration(data)}
          ip={null}
        />
      )}

      {editIntegration && (
        <IntegrationUpdateDialog
          integration={editIntegration}
          open={true}
          onClose={() => setEditIntegration(null)}
          onUpdate={(data) => handleUpdateIntegration(data)}
          ip={null}
        />
      )}
    </div>
  );
}
