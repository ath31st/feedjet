import * as Dialog from '@radix-ui/react-dialog';
import type { NewIntegration } from '@/entities/integration';
import { useCreateIntegrationForm } from '../model/useCreateIntegrationForm';
import { IntegrationForm } from '@/shared/ui';

interface IntegrationCreateDialogProps {
  open: boolean;
  onClose: () => void;
  onCreate: (data: NewIntegration) => void;
}

export function IntegrationCreateDialog({
  open,
  onClose,
  onCreate,
}: IntegrationCreateDialogProps) {
  const { formData, handleSubmit, handleChange, handleCancel } =
    useCreateIntegrationForm(onCreate, onClose);

  return (
    <Dialog.Root open={open} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="-translate-x-1/2 -translate-y-1/2 fixed top-1/2 left-1/2 w-[500px] max-w-[90vw] rounded-lg bg-[var(--card-bg)] p-5 shadow-xl">
          <div className="mb-4 flex items-center justify-between">
            <Dialog.Title className="font-semibold text-lg">
              Создать интеграцию
            </Dialog.Title>
          </div>

          <Dialog.Description className="sr-only">
            Форма для создания новой интеграции
          </Dialog.Description>

          <IntegrationForm
            mode="create"
            formData={formData}
            onChange={handleChange}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
