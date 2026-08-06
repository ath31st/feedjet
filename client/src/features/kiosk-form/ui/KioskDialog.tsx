import { useKioskForm } from '../model/useKioskForm';
import type { Kiosk, NewKiosk, UpdateKiosk } from '@/entities/kiosk';
import { CommonDialog } from '@/shared/ui/common';
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
    <CommonDialog open={props.open} onClose={props.onClose} size="md">
      <CommonDialog.Header
        title={
          props.mode === 'create' ? 'Создать киоск' : 'Редактировать киоск'
        }
      />

      <CommonDialog.Body>
        <form onSubmit={submit}>
          <KioskForm mode={mode} form={form} onCancel={cancel} />
        </form>
      </CommonDialog.Body>
    </CommonDialog>
  );
}
