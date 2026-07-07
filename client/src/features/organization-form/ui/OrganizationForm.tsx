import { FormField, sharedInputStyles } from '@/shared/ui';
import { CommonButton } from '@/shared/ui/common';
import { CheckIcon, ResetIcon } from '@radix-ui/react-icons';
import type { UseFormReturn } from 'react-hook-form';
import type {
  Mode,
  OrganizationFormValues,
} from '../model/useOrganizationForm';

type Props = {
  mode: Mode;
  form: UseFormReturn<OrganizationFormValues>;
  onCancel: () => void;
};

export function OrganizationForm({ mode, form, onCancel }: Props) {
  const isCreate = mode === 'create';

  const { register, watch } = form;

  const name = watch('name');
  const slug = watch('slug');

  return (
    <div className="space-y-2">
      <FormField
        id="organization-slug"
        label="Slug"
        required
        maxLength={50}
        currentLength={slug.length}
        hint="только латинские буквы, цифры и дефисы"
      >
        <input
          id="organization-slug"
          disabled={!isCreate}
          className={sharedInputStyles}
          maxLength={50}
          placeholder="hall-1"
          {...register('slug', {
            required: true,
            pattern: /^[a-z0-9-]+$/,
            setValueAs: (v: string) => v.toLowerCase(),
          })}
        />
      </FormField>

      <FormField
        id="organization-name"
        label="Название"
        required
        maxLength={50}
        currentLength={name.length}
      >
        <input
          id="organization-name"
          className={sharedInputStyles}
          maxLength={50}
          {...register('name', { required: true })}
        />
      </FormField>

      <div className="flex justify-end gap-2">
        <CommonButton type="button" onClick={onCancel}>
          <ResetIcon />
        </CommonButton>

        <CommonButton type="submit">
          <CheckIcon />
        </CommonButton>
      </div>
    </div>
  );
}
