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
          Название *
        </label>
        <input
          id="kiosk-name"
          type="text"
          required
          value={formData.name}
          onChange={(e) => onChange('name', e.target.value)}
          className="w-full rounded border px-2 py-1 text-sm"
        />
      </div>

      <div>
        <label htmlFor="kiosk-slug" className="mb-1 block font-medium text-sm">
          Slug *
        </label>
        <input
          id="kiosk-slug"
          type="text"
          required
          value={formData.slug}
          onChange={(e) => onChange('slug', e.target.value)}
          className="w-full rounded border px-2 py-1 text-sm"
          placeholder="например, main-hall"
        />
      </div>

      <div>
        <label
          htmlFor="kiosk-description"
          className="mb-1 block font-medium text-sm"
        >
          Описание
        </label>
        <textarea
          id="kiosk-description"
          value={formData.description}
          onChange={(e) => onChange('description', e.target.value)}
          className="w-full rounded border px-2 py-1 text-sm"
          rows={3}
        />
      </div>

      <div>
        <label
          htmlFor="kiosk-location"
          className="mb-1 block font-medium text-sm"
        >
          Местоположение
        </label>
        <input
          id="kiosk-location"
          type="text"
          value={formData.location}
          onChange={(e) => onChange('location', e.target.value)}
          className="w-full rounded border px-2 py-1 text-sm"
          placeholder="например, 1 этаж, холл"
        />
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
