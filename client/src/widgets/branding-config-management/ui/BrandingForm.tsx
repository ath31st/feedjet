import { useBranding } from '../model/useBrandingConfig';
import { FormField, sharedInputStyles } from '@/shared/ui';
import { CommonButton } from '@/shared/ui/common';
import { CheckIcon, ResetIcon } from '@radix-ui/react-icons';

export function BrandingForm() {
  const { form, onSubmit, isLoading, onCancel } = useBranding();

  if (isLoading) {
    return null;
  }

  const {
    register,
    watch,
    formState: { isDirty, isSubmitting },
  } = form;

  return (
    <form onSubmit={onSubmit} className="flex w-full flex-col items-end gap-4">
      <FormField
        id="organization-name"
        label="Наименование организации"
        maxLength={50}
        currentLength={watch('organizationName').length}
      >
        <input
          id="organization-name"
          type="text"
          maxLength={50}
          placeholder="Название организации"
          className={sharedInputStyles}
          {...register('organizationName')}
        />
      </FormField>

      <FormField
        id="schedule-header-title"
        label="Заголовок расписания"
        maxLength={50}
        currentLength={watch('scheduleHeaderTitle').length}
      >
        <input
          id="schedule-header-title"
          type="text"
          maxLength={50}
          placeholder="Расписание мероприятий"
          className={sharedInputStyles}
          {...register('scheduleHeaderTitle')}
        />
      </FormField>

      <div className="flex justify-end gap-2">
        <CommonButton type="button" onClick={onCancel}>
          <ResetIcon />
        </CommonButton>

        <CommonButton disabled={!isDirty || isSubmitting} type="submit">
          <CheckIcon />
        </CommonButton>
      </div>
    </form>
  );
}
