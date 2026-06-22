import { SettingsCard } from '@/shared/ui';
import { IntegrationList } from './IntegrationList';
import { IntegrationCreateDialog } from '@/features/integration-create-update';
import { useIntegrationWidget } from '../model/useIntegrationWidget';
import { CommonButton } from '@/shared/ui/common';
import { Link2Icon } from 'lucide-react';

export function IntegrationManagement() {
  const { handleCreateIntegration, openCreateDialog, setOpenCreateDialog } =
    useIntegrationWidget();

  return (
    <div className="flex flex-row gap-6">
      <div className="flex w-full flex-col gap-6 md:w-2/5">
        <SettingsCard title="Создание интеграции" className="w-full">
          <div className="flex flex-col">
            <CommonButton
              onClick={() => setOpenCreateDialog(true)}
              type="button"
            >
              <div className="flex flex-row items-center justify-center gap-2">
                <Link2Icon />
                {'Добавить интеграцию'}
              </div>
            </CommonButton>
          </div>
        </SettingsCard>

        <SettingsCard title="Устройства без интеграции" className="w-full">
          <div />
        </SettingsCard>
      </div>

      <SettingsCard title="Список интеграций" className="w-full md:w-3/5">
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
    </div>
  );
}
