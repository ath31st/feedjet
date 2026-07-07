import * as Dialog from '@radix-ui/react-dialog';
import { OrganizationForm } from './OrganizationForm';
import { useOrganizationForm } from '../model/useOrganizationForm';
import type {
  NewOrganization,
  Organization,
  UpdateOrganization,
} from '@/entities/organization';

type Props =
  | {
      open: boolean;
      mode: 'create';
      onClose: () => void;
      onSubmit: (data: NewOrganization) => void;
    }
  | {
      open: boolean;
      mode: 'update';
      organization: Organization;
      onClose: () => void;
      onSubmit: (organizationId: number, data: UpdateOrganization) => void;
    };

export function OrganizationDialog(props: Props) {
  const { form, submit, cancel } = useOrganizationForm(props);

  return (
    <Dialog.Root open={props.open} onOpenChange={props.onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />

        <Dialog.Content className="fixed top-1/2 left-1/2 w-125 -translate-x-1/2 -translate-y-1/2 rounded-lg bg-(--card-bg) p-5 shadow-xl">
          <Dialog.Title className="mb-4 font-semibold text-lg">
            {props.mode === 'create'
              ? 'Создать организацию'
              : 'Редактировать организацию'}
          </Dialog.Title>

          <form onSubmit={submit}>
            <OrganizationForm mode={props.mode} form={form} onCancel={cancel} />
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
