import type { NewIntegration } from '@/entities/integration';
import { useCreateIntegrationForm } from '../model/useCreateIntegrationForm';
import { IntegrationForm } from '@/shared/ui';
import { CommonDialog } from '@/shared/ui/common';
import { PhilipsCreateFlow } from './PhilipsCreateFlow';

interface IntegrationCreateDialogProps {
  open: boolean;
  ip: string | null;
  onClose: () => void;
  onCreate: (data: NewIntegration) => void;
}

export function IntegrationCreateDialog({
  open,
  ip,
  onClose,
  onCreate,
}: IntegrationCreateDialogProps) {
  const {
    formData,
    config,
    handleSubmit,
    handleChange,
    handleCancel,
    handleConfigChange,
    handleTypeChange,
  } = useCreateIntegrationForm(ip, onCreate, onClose);

  return (
    <CommonDialog open={open} onClose={onClose} size="md">
      <CommonDialog.Header title="Создать интеграцию" />

      <CommonDialog.Body>
        {formData.type === 'philips_jointspace' ? (
          <PhilipsCreateFlow
            formData={formData}
            onChange={handleChange}
            onTypeChange={handleTypeChange}
            onClose={onClose}
          />
        ) : (
          <IntegrationForm
            mode="create"
            formData={formData}
            config={config}
            onChange={handleChange}
            onTypeChange={handleTypeChange}
            onConfigChange={handleConfigChange}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        )}
      </CommonDialog.Body>
    </CommonDialog>
  );
}
