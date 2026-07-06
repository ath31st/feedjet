import * as Dialog from '@radix-ui/react-dialog';
import { useKioskForm } from '../model/useKioskForm';
import type { Kiosk, NewKiosk, UpdateKiosk } from '@/entities/kiosk';
import { KioskForm } from './KioskForm';

type Props =
  | {
      open: boolean;
      mode: 'create';
      kiosk?: never;
      onClose: () => void;
      onCreate: (data: NewKiosk) => void;
      onUpdate?: never;
    }
  | {
      open: boolean;
      mode: 'update';
      kiosk: Kiosk;
      onClose: () => void;
      onUpdate: (kioskId: number, data: UpdateKiosk) => void;
      onCreate?: never;
    };

export function KioskDialog(props: Props) {
  const { form, submit, cancel, mode } = useKioskForm(props);

  return (
    <Dialog.Root open={props.open} onOpenChange={props.onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />

        <Dialog.Content className="fixed top-1/2 left-1/2 w-125 -translate-x-1/2 -translate-y-1/2 rounded-lg bg-(--card-bg) p-5 shadow-xl">
          <Dialog.Title className="mb-4 font-semibold text-lg">
            {props.mode === 'create' ? 'Создать киоск' : 'Редактировать киоск'}
          </Dialog.Title>

          <form onSubmit={submit}>
            <KioskForm mode={mode} form={form} onCancel={cancel} />
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
