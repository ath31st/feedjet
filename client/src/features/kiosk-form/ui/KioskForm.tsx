import { FormField, sharedInputStyles } from '@/shared/ui';
import { CommonButton, CommonSwitch } from '@/shared/ui/common';
import { CheckIcon, ResetIcon } from '@radix-ui/react-icons';
import type { UseFormReturn } from 'react-hook-form';
import type { KioskFormValues, Mode } from '../model/useKioskForm';

interface KioskFormProps {
  mode: Mode;
  form: UseFormReturn<KioskFormValues>;
  onCancel: () => void;
}

export function KioskForm({ mode, form, onCancel }: KioskFormProps) {
  const isCreate = mode === 'create';

  const { register, watch, setValue } = form;

  const slug = watch('slug');
  const name = watch('name');
  const location = watch('location');
  const description = watch('description');
  const isActive = watch('isActive');

  return (
    <div className="space-y-2">
      <FormField
        id="kiosk-slug"
        label="Slug"
        required={isCreate}
        maxLength={50}
        currentLength={slug.length}
        hint={isCreate ? 'только латинские буквы, цифры и дефисы' : undefined}
      >
        <input
          id="kiosk-slug"
          type="text"
          disabled={!isCreate}
          className={sharedInputStyles}
          maxLength={50}
          placeholder="например, main-hall"
          {...register('slug', {
            required: isCreate,
            pattern: /^[a-z0-9-]+$/,
            setValueAs: (v: string) => v.toLowerCase(),
          })}
        />
      </FormField>

      <FormField
        id="kiosk-name"
        label="Название"
        required
        maxLength={30}
        currentLength={name.length}
      >
        <input
          id="kiosk-name"
          type="text"
          className={sharedInputStyles}
          maxLength={30}
          {...register('name', {
            required: true,
          })}
        />
      </FormField>

      <FormField
        id="kiosk-location"
        label="Местоположение"
        maxLength={200}
        currentLength={location.length}
      >
        <input
          id="kiosk-location"
          type="text"
          className={sharedInputStyles}
          placeholder="например, 1 этаж, холл"
          maxLength={200}
          {...register('location')}
        />
      </FormField>

      {!isCreate && (
        <div className="flex justify-between">
          <span className="block font-medium text-sm">
            Конфигурация киоска включена
          </span>

          <CommonSwitch
            checked={isActive}
            onCheckedChange={(checked) =>
              setValue('isActive', checked, {
                shouldDirty: true,
                shouldTouch: true,
              })
            }
          />
        </div>
      )}

      <FormField
        id="kiosk-description"
        label="Описание"
        maxLength={200}
        currentLength={description.length}
      >
        <textarea
          id="kiosk-description"
          rows={3}
          className={sharedInputStyles}
          maxLength={200}
          {...register('description')}
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
