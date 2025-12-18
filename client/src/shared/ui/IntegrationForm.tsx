import {
  integrationFull,
  type Integration,
  type IntegrationType,
} from '@/entities/integration';
import { CommonButton, SimpleDropdownMenu } from '@/shared/ui/common';
import { CheckIcon, LinkBreak2Icon, ResetIcon } from '@radix-ui/react-icons';
import { FormField, sharedInputStyles } from './common/FormField';

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
  onDelete?: () => void;
}

export function IntegrationForm({
  mode,
  integration,
  formData,
  onChange,
  onSubmit,
  onCancel,
  onDelete,
}: IntegrationFormProps) {
  const isCreate = mode === 'create';
  console.log(formData);

  return (
    <form onSubmit={onSubmit} className="space-y-2">
      <FormField
        id="integration-type"
        label="Тип интеграции"
        required={isCreate}
      >
        {isCreate ? (
          <SimpleDropdownMenu
            value={formData.type}
            options={integrationFull.map((i) => i.type)}
            onSelect={(value) => onChange('type', value as IntegrationType)}
          />
        ) : (
          <input
            id="integration-type"
            type="text"
            disabled
            className={sharedInputStyles}
            value={
              integrationFull.find((i) => i.type === integration?.type)
                ?.label ?? formData.type
            }
          />
        )}
      </FormField>

      <FormField
        id="integration-login"
        label="Логин"
        maxLength={100}
        currentLength={formData.login?.length}
      >
        <input
          id="integration-login"
          type="text"
          className={sharedInputStyles}
          value={formData.login ?? ''}
          onChange={(e) => onChange('login', e.target.value)}
        />
      </FormField>

      <FormField
        id="integration-password"
        label="Пароль"
        required={formData.type === 'fully_kiosk'}
        hint={
          mode === 'update'
            ? 'Оставьте пустым, если не нужно менять'
            : undefined
        }
        maxLength={100}
        currentLength={formData.password?.length}
      >
        <input
          id="integration-password"
          type="password"
          className={sharedInputStyles}
          value={formData.password ?? ''}
          onChange={(e) => onChange('password', e.target.value)}
          autoComplete="current-password"
          required={formData.type === 'fully_kiosk'}
        />
      </FormField>

      <FormField
        id="integration-description"
        label="Описание"
        maxLength={500}
        currentLength={formData.description?.length}
      >
        <textarea
          id="integration-description"
          rows={3}
          className={sharedInputStyles}
          value={formData.description ?? ''}
          onChange={(e) => onChange('description', e.target.value)}
          placeholder="Например: https://device.local или комментарий"
          maxLength={200}
        />
      </FormField>

      <div className="flex justify-end gap-2">
        {onDelete && (
          <CommonButton
            tooltip="Удалить интеграцию"
            type="button"
            onClick={onDelete}
          >
            <LinkBreak2Icon />
          </CommonButton>
        )}
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
