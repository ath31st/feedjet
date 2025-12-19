import type { Kiosk } from '@/entities/kiosk';
import { CommonButton } from '@/shared/ui/common';
import { CheckIcon, ResetIcon } from '@radix-ui/react-icons';
import { FormField, sharedInputStyles } from './common/FormField';
import * as Switch from '@radix-ui/react-switch';

type KioskFormData = {
  name?: string;
  slug?: string;
  description?: string;
  location?: string;
  isActive?: boolean;
};

interface KioskFormProps {
  mode: 'create' | 'update';
  kiosk?: Kiosk;
  formData: KioskFormData;
  onChange: (
    field: 'name' | 'slug' | 'description' | 'location' | 'isActive',
    value: string | boolean,
  ) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export function KioskForm({
  mode,
  kiosk,
  formData,
  onChange,
  onSubmit,
  onCancel,
}: KioskFormProps) {
  const isCreate = mode === 'create';

  return (
    <form onSubmit={onSubmit} className="space-y-2">
      <FormField
        id="kiosk-slug"
        label="Slug"
        required={isCreate}
        maxLength={isCreate ? 50 : undefined}
        currentLength={formData.slug?.length}
        hint={isCreate ? 'только латинские буквы, цифры и дефисы' : ''}
      >
        <input
          id="kiosk-slug"
          type="text"
          disabled={!isCreate}
          required={isCreate}
          pattern={isCreate ? '[a-z0-9-]+' : undefined}
          value={isCreate ? formData.slug : kiosk?.slug}
          onChange={(e) => onChange('slug', e.target.value.toLowerCase())}
          className={sharedInputStyles}
          maxLength={50}
          placeholder="например, main-hall"
        />
      </FormField>

      <FormField
        id="kiosk-name"
        label="Название"
        required={!isCreate}
        maxLength={30}
        currentLength={formData.name?.length}
      >
        <input
          id="kiosk-name"
          type="text"
          required={!isCreate}
          value={formData.name}
          onChange={(e) => onChange('name', e.target.value)}
          className={sharedInputStyles}
          maxLength={30}
        />
      </FormField>

      <FormField
        id="kiosk-location"
        label="Местоположение"
        maxLength={200}
        currentLength={formData.location?.length}
      >
        <input
          id="kiosk-location"
          type="text"
          value={formData.location}
          onChange={(e) => onChange('location', e.target.value)}
          className={sharedInputStyles}
          placeholder="например, 1 этаж, холл"
          maxLength={200}
        />
      </FormField>

      {!isCreate && (
        <div className="flex justify-between">
          <span className="block font-medium text-sm">
            Конфигурация киоска включена
          </span>
          <Switch.Root
            checked={formData.isActive ?? false}
            onCheckedChange={(checked) => onChange('isActive', checked)}
            className="relative h-5 w-10 shrink-0 cursor-pointer rounded-full border border-(--border) transition-colors data-[state=checked]:bg-(--button-bg)"
          >
            <Switch.Thumb className="block h-4 w-4 translate-x-[1px] rounded-full bg-(--text) transition-transform data-[state=checked]:translate-x-[21px]" />
          </Switch.Root>
        </div>
      )}

      <FormField
        id="kiosk-description"
        label="Описание"
        maxLength={200}
        currentLength={formData.description?.length}
      >
        <textarea
          id="kiosk-description"
          rows={3}
          value={formData.description}
          onChange={(e) => onChange('description', e.target.value)}
          className={sharedInputStyles}
          maxLength={200}
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
    </form>
  );
}
