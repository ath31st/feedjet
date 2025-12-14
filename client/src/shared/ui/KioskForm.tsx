import type { Kiosk } from '@/entities/kiosk';
import { CommonButton } from '@/shared/ui/common';
import { CheckIcon, ResetIcon } from '@radix-ui/react-icons';

type KioskFormData = {
  name?: string;
  slug?: string;
  description?: string;
  location?: string;
};

interface KioskFormProps {
  mode: 'create' | 'update';
  kiosk?: Kiosk;
  formData: KioskFormData;
  onChange: (
    field: 'name' | 'slug' | 'description' | 'location',
    value: string,
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
  const isUpdate = mode === 'update';

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {mode === 'create' ? (
        <div>
          <label
            htmlFor="kiosk-slug"
            className="mb-1 block font-medium text-sm"
          >
            Slug * (только латинские буквы, цифры и дефисы)
          </label>
          <input
            id="kiosk-slug"
            type="text"
            required
            maxLength={50}
            pattern="[a-z0-9-]+"
            title="Только латинские буквы в нижнем регистре, цифры и дефисы"
            value={formData.slug}
            onChange={(e) => onChange('slug', e.target.value.toLowerCase())}
            className="w-full rounded-lg border border-[var(--border)] px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--border)]"
            placeholder="например, main-hall"
          />
          <div className="mt-1 text-[var(--meta-text)] text-xs">
            {formData.slug?.length}/50 символов
          </div>
        </div>
      ) : (
        <div>
          <label
            htmlFor="kiosk-slug"
            className="mb-1 block font-medium text-sm"
          >
            Slug
          </label>
          <input
            id="kiosk-slug"
            type="text"
            disabled
            value={kiosk?.slug}
            className="w-full rounded-lg border border-(--border-disabled) px-2 py-1 text-sm"
          />
        </div>
      )}

      <div>
        <label htmlFor="kiosk-name" className="mb-1 block font-medium text-sm">
          Название * (макс. 10 символов)
        </label>
        <input
          id="kiosk-name"
          type="text"
          required={!isUpdate}
          maxLength={30}
          value={formData.name}
          onChange={(e) => onChange('name', e.target.value)}
          className="w-full rounded-lg border border-[var(--border)] px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--border)]"
        />
        <div className="mt-1 text-[var(--meta-text)] text-xs">
          {formData.name?.length}/30 символов
        </div>
      </div>

      <div>
        <label
          htmlFor="kiosk-description"
          className="mb-1 block font-medium text-sm"
        >
          Описание (макс. 200 символов)
        </label>
        <textarea
          id="kiosk-description"
          maxLength={200}
          value={formData.description}
          onChange={(e) => onChange('description', e.target.value)}
          className="w-full rounded-lg border border-[var(--border)] px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--border)]"
          rows={3}
        />
        <div className="mt-1 text-[var(--meta-text)] text-xs">
          {formData.description?.length}/200 символов
        </div>
      </div>

      <div>
        <label
          htmlFor="kiosk-location"
          className="mb-1 block font-medium text-sm"
        >
          Местоположение (макс. 200 символов)
        </label>
        <input
          id="kiosk-location"
          type="text"
          maxLength={200}
          value={formData.location}
          onChange={(e) => onChange('location', e.target.value)}
          className="w-full rounded-lg border border-[var(--border)] px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--border)]"
          placeholder="например, 1 этаж, холл"
        />
        <div className="mt-1 text-[var(--meta-text)] text-xs">
          {formData.location?.length}/200 символов
        </div>
      </div>

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
