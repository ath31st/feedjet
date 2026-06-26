import * as Dialog from '@radix-ui/react-dialog';
import type { Integration, UpdateIntegration } from '@/entities/integration';
import { useUpdateIntegrationForm } from '../model/useUpdateIntegrationForm';
import { IntegrationForm } from '@/shared/ui';

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
    <Dialog.Root open={open} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 w-125 max-w-[90vw] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-(--card-bg) p-5 shadow-xl">
          <div className="mb-4 flex items-center justify-between">
            <Dialog.Title className="font-semibold text-lg">
              Обновить интеграцию
            </Dialog.Title>
          </div>

          <Dialog.Description className="sr-only">
            Форма для обновления новой интеграции
          </Dialog.Description>

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
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
