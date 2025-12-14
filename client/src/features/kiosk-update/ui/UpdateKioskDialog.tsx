import * as Dialog from '@radix-ui/react-dialog';
import type { Kiosk, UpdateKiosk } from '@/entities/kiosk';
import { useUpdateKioskForm } from '../model/useUpdateKioskForm';
import { KioskForm } from '@/shared/ui';

interface UpdateKioskDialogProps {
  kiosk: Kiosk;
  open: boolean;
  onClose: () => void;
  onUpdate: (data: UpdateKiosk) => void;
}

export function UpdateKioskDialog({
  kiosk,
  open,
  onClose,
  onUpdate,
}: UpdateKioskDialogProps) {
  const { formData, handleSubmit, handleChange, handleCancel } =
    useUpdateKioskForm(kiosk, onUpdate, onClose);

  return (
    <Dialog.Root open={open} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="-translate-x-1/2 -translate-y-1/2 fixed top-1/2 left-1/2 w-[500px] rounded-lg bg-[var(--card-bg)] p-5 shadow-xl">
          <Dialog.Title className="mb-4 font-semibold text-lg">
            Редактировать киоск
          </Dialog.Title>

          <KioskForm
            mode="update"
            kiosk={kiosk}
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
