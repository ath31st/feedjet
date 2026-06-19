import { LoadingThreeDotsJumping } from '@/shared/ui';
import { IntegrationCard } from './IntegrationCard';
import { useIntegrationWidget } from '../model/useIntegrationWidget';

export function IntegrationList() {
  const {
    isLoadingIntegrations,
    integrations,
    handleDeleteIntegration,
    editIntegration,
    setEditIntegration,
    handleUpdateIntegration,
  } = useIntegrationWidget();

  if (isLoadingIntegrations) return <LoadingThreeDotsJumping />;
  if (!integrations?.length) return <p>Интеграции отсутствуют</p>;

  return (
    <div className="flex flex-col gap-2">
      {integrations.map((integration) => (
        <IntegrationCard
          key={integration.id}
          integration={integration}
          onDelete={handleDeleteIntegration}
          editIntegration={editIntegration}
          setEditIntegration={setEditIntegration}
          onUpdate={handleUpdateIntegration}
        />
      ))}
    </div>
  );
}
