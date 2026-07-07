import { useForm } from 'react-hook-form';
import type {
  Organization,
  NewOrganization,
  UpdateOrganization,
} from '@/entities/organization';

export type Mode = 'create' | 'update';

export type OrganizationFormValues = {
  name: string;
  slug: string;
};

type Params =
  | {
      mode: 'create';
      organization?: never;
      onSubmit: (data: NewOrganization) => void;
      onClose: () => void;
    }
  | {
      mode: 'update';
      organization: Organization;
      onSubmit: (organizationId: number, data: UpdateOrganization) => void;
      onClose: () => void;
    };

export function useOrganizationForm(params: Params) {
  const form = useForm<OrganizationFormValues>({
    defaultValues:
      params.mode === 'create'
        ? {
            name: '',
            slug: '',
          }
        : {
            name: params.organization.name,
            slug: params.organization.slug,
          },
  });

  const submit = form.handleSubmit((data) => {
    if (params.mode === 'create') {
      params.onSubmit({
        name: data.name.trim(),
        slug: data.slug.trim(),
      });

      form.reset();
      params.onClose();
      return;
    }

    const org = params.organization;

    const payload: UpdateOrganization = {
      name: data.name !== org.name ? data.name.trim() : undefined,
      slug: data.slug !== org.slug ? data.slug.trim() : undefined,
    };

    params.onSubmit(org.id, payload);
    params.onClose();
  });

  const cancel = () => {
    form.reset();
    params.onClose();
  };

  return {
    form,
    submit,
    cancel,
  };
}
