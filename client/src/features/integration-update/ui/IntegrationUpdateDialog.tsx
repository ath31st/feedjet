import * as Dialog from '@radix-ui/react-dialog';
import type {
  Integration,
  IntegrationType,
  UpdateIntegration,
} from '@/entities/integration';
import { useUpdateIntegrationForm } from '../model/useUpdateIntegrationForm';
import { IntegrationForm } from '@/shared/ui';

interface IntegrationUpdateDialogProps {
  integration: Integration;
  open: boolean;
  onClose: () => void;
  onUpdate: (data: UpdateIntegration) => void;
  onDelete: (kioskId: number, type: IntegrationType) => void;
}

export function IntegrationUpdateDialog({
  integration,
  open,
  onClose,
  onUpdate,
  onDelete,
}: IntegrationUpdateDialogProps) {
  const { formData, handleSubmit, handleChange, handleCancel, handleDelete } =
    useUpdateIntegrationForm(integration, onUpdate, onClose, onDelete);

  return (
    <Dialog.Root open={open} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="-translate-x-1/2 -translate-y-1/2 fixed top-1/2 left-1/2 w-[500px] max-w-[90vw] rounded-lg bg-[var(--card-bg)] p-5 shadow-xl">
          <div className="mb-4 flex items-center justify-between">
            <Dialog.Title className="font-semibold text-lg">
              Обновить интеграцию
            </Dialog.Title>
          </div>

          <Dialog.Description className="sr-only">
            Форма для обновления новой интеграции
          </Dialog.Description>

          <IntegrationForm
            mode="update"
            integration={integration}
            formData={formData}
            onChange={handleChange}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            onDelete={handleDelete}
          />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
