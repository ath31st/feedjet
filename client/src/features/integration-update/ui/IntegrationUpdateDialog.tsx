import type { Integration, UpdateIntegration } from '@/entities/integration';
import { useUpdateIntegrationForm } from '../model/useUpdateIntegrationForm';
import { IntegrationForm } from '@/shared/ui';
import { CommonDialog } from '@/shared/ui/common';

interface IntegrationUpdateDialogProps {
  integration: Integration;
  open: boolean;
  onClose: () => void;
  onUpdate: (data: UpdateIntegration) => void;
}

export function IntegrationUpdateDialog({
  integration,
  open,
  onClose,
  onUpdate,
}: IntegrationUpdateDialogProps) {
  const {
    config,
    formData,
    handleSubmit,
    handleChange,
    handleCancel,
    handleConfigChange,
  } = useUpdateIntegrationForm(integration, onUpdate, onClose);

  return (
    <CommonDialog open={open} onClose={onClose} size="md">
      <CommonDialog.Header title="Обновить интеграцию" />

      <CommonDialog.Body>
        <IntegrationForm
          mode="update"
          integration={integration}
          config={config}
          formData={formData}
          onChange={handleChange}
          onConfigChange={handleConfigChange}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </CommonDialog.Body>
    </CommonDialog>
  );
}
