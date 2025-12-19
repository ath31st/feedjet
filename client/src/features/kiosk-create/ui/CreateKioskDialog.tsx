import * as Dialog from '@radix-ui/react-dialog';
import type { NewKiosk } from '@/entities/kiosk';
import { useCreateKioskForm } from '../model/useCreateKioskForm';
import { KioskForm } from '@/shared/ui';

interface CreateKioskDialogProps {
  open: boolean;
  onClose: () => void;
  onCreate: (data: NewKiosk) => void;
}

export function CreateKioskDialog({
  open,
  onClose,
  onCreate,
}: CreateKioskDialogProps) {
  const { formData, handleSubmit, handleChange, handleCancel } =
    useCreateKioskForm(onCreate, onClose);

  return (
    <Dialog.Root open={open} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="-translate-x-1/2 -translate-y-1/2 fixed top-1/2 left-1/2 w-[500px] max-w-[90vw] rounded-lg bg-[var(--card-bg)] p-5 shadow-xl">
          <div className="mb-4 flex items-center justify-between">
            <Dialog.Title className="font-semibold text-lg">
              Создать киоск
            </Dialog.Title>
          </div>

          <Dialog.Description className="sr-only">
            Форма для создания нового киоска
          </Dialog.Description>

          <KioskForm
            mode="create"
            formData={formData}
            // biome-ignore lint/suspicious/noExplicitAny: ignore this any for common interface
            onChange={handleChange as any}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
