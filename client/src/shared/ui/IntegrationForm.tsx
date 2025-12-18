import {
  integrationFull,
  type Integration,
  type IntegrationType,
} from '@/entities/integration';
import { CommonButton } from '@/shared/ui/common';
import { CheckIcon, ResetIcon } from '@radix-ui/react-icons';

export type IntegrationFormData = {
  type: IntegrationType;
  description?: string;
  login?: string;
  password?: string;
};

interface IntegrationFormProps {
  mode: 'create' | 'update';
  integration?: Integration;
  formData: IntegrationFormData;
  onChange: <K extends keyof IntegrationFormData>(
    field: K,
    value: IntegrationFormData[K],
  ) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export function IntegrationForm({
  mode,
  integration,
  formData,
  onChange,
  onSubmit,
  onCancel,
}: IntegrationFormProps) {
  const isCreate = mode === 'create';

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="integration-type"
          className="mb-1 block font-medium text-sm"
        >
          Тип интеграции *
        </label>

        {isCreate ? (
          <select
            value={formData.type}
            onChange={(e) =>
              onChange('type', e.target.value as IntegrationType)
            }
            className="w-full rounded-lg border border-(--border) px-2 py-1 text-sm"
            required
          >
            <option value="" disabled>
              Выберите тип
            </option>
            {integrationFull.map((i) => (
              <option key={i.type} value={i.type}>
                {i.label}
              </option>
            ))}
          </select>
        ) : (
          <input
            type="text"
            disabled
            value={
              integrationFull.find((i) => i.type === integration?.type)
                ?.label ?? formData.type
            }
            className="w-full rounded-lg border border-(--border-disabled) px-2 py-1 text-sm"
          />
        )}
      </div>

      <div>
        <label
          htmlFor="integration-description"
          className="mb-1 block font-medium text-sm"
        >
          Описание
        </label>
        <input
          type="text"
          value={formData.description ?? ''}
          onChange={(e) => onChange('description', e.target.value)}
          className="w-full rounded-lg border border-(--border) px-2 py-1 text-sm"
          placeholder="Например: https://device.local или комментарий"
        />
      </div>

      <div>
        <label
          htmlFor="integration-login"
          className="mb-1 block font-medium text-sm"
        >
          Логин
        </label>
        <input
          type="text"
          value={formData.login ?? ''}
          onChange={(e) => onChange('login', e.target.value)}
          className="w-full rounded-lg border border-(--border) px-2 py-1 text-sm"
          autoComplete="username"
        />
      </div>

      <div>
        <label
          htmlFor="integration-password"
          className="mb-1 block font-medium text-sm"
        >
          Пароль
          {formData.type === 'fully_kiosk' && ' *'}
        </label>
        <input
          type="password"
          value={formData.password ?? ''}
          onChange={(e) => onChange('password', e.target.value)}
          className="w-full rounded-lg border border-(--border) px-2 py-1 text-sm"
          autoComplete="current-password"
          required={formData.type === 'fully_kiosk'}
        />
        {mode === 'update' && (
          <div className="mt-1 text-(--meta-text) text-xs">
            Оставьте пустым, если не нужно менять пароль
          </div>
        )}
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
