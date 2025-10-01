import type { NewKiosk } from '@/entities/kiosk';
import { CommonButton } from '@/shared/ui/common/CommonButton';
import { CheckIcon, ResetIcon } from '@radix-ui/react-icons';

interface CreateKioskFormProps {
  formData: NewKiosk;
  onChange: (field: keyof NewKiosk, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export function CreateKioskForm({
  formData,
  onChange,
  onSubmit,
  onCancel,
}: CreateKioskFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label htmlFor="kiosk-name" className="mb-1 block font-medium text-sm">
          Название * (макс. 10 символов)
        </label>
        <input
          id="kiosk-name"
          type="text"
          required
          maxLength={10}
          value={formData.name}
          onChange={(e) => onChange('name', e.target.value)}
          className="w-full rounded border px-2 py-1 text-sm"
        />
        <div className="mt-1 text-[var(--meta-text)] text-xs">
          {formData.name.length}/10 символов
        </div>
      </div>

      <div>
        <label htmlFor="kiosk-slug" className="mb-1 block font-medium text-sm">
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
          className="w-full rounded border px-2 py-1 text-sm"
          placeholder="например, main-hall"
        />
        <div className="mt-1 text-[var(--meta-text)] text-xs">
          {formData.slug.length}/50 символов
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
          value={formData.description || ''}
          onChange={(e) => onChange('description', e.target.value)}
          className="w-full rounded border px-2 py-1 text-sm"
          rows={3}
        />
        <div className="mt-1 text-[var(--meta-text)] text-xs">
          {(formData.description || '').length}/200 символов
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
          value={formData.location || ''}
          onChange={(e) => onChange('location', e.target.value)}
          className="w-full rounded border px-2 py-1 text-sm"
          placeholder="например, 1 этаж, холл"
        />
        <div className="mt-1 text-[var(--meta-text)] text-xs">
          {(formData.location || '').length}/200 символов
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
