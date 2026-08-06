import { OrganizationForm } from './OrganizationForm';
import { useOrganizationForm } from '../model/useOrganizationForm';
import type {
  NewOrganization,
  Organization,
  UpdateOrganization,
} from '@/entities/organization';
import { CommonDialog } from '@/shared/ui/common';

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
    <CommonDialog open={props.open} onClose={props.onClose} size="md">
      <CommonDialog.Header
        title={
          props.mode === 'create'
            ? 'Создать организацию'
            : 'Редактировать организацию'
        }
      />

      <CommonDialog.Body>
        <form onSubmit={submit}>
          <OrganizationForm mode={props.mode} form={form} onCancel={cancel} />
        </form>
      </CommonDialog.Body>
    </CommonDialog>
  );
}
