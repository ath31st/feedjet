import { SettingsCard } from '@/shared/ui';
import { IntegrationList } from './IntegrationList';
import { IntegrationCreateDialog } from '@/features/integration-create-update';
import { IntegrationUpdateDialog } from '@/features/integration-update';
import { useIntegrationWidget } from '../model/useIntegrationWidget';

export function IntegrationManagement() {
  const {
    createIntegrationFor,
    setCreateIntegrationFor,
    editIntegration,
    setEditIntegration,
    handleCreateIntegration,
    handleUpdateIntegration,
  } = useIntegrationWidget();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex w-full flex-row gap-6">
        <SettingsCard title="Создание интеграции" className="w-full md:w-2/5">
          <IntegrationList />
        </SettingsCard>

        <SettingsCard
          title="Устройства без интеграции"
          className="w-full md:w-3/5"
        >
          <IntegrationList />
        </SettingsCard>
      </div>
      <SettingsCard title="Список интеграций" className="w-full">
        <IntegrationList />
      </SettingsCard>

      {createIntegrationFor && (
        <IntegrationCreateDialog
          open={true}
          onClose={() => setCreateIntegrationFor(null)}
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
