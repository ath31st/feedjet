import {
  integrationFull,
  type Integration,
  type IntegrationType,
  type IntegrationConfig,
  type FullyKioskConfig,
} from '@/entities/integration';
import { CommonButton, SimpleDropdownMenu } from '@/shared/ui/common';
import { CheckIcon, ResetIcon } from '@radix-ui/react-icons';
import { FormField, sharedInputStyles } from './common/FormField';

export type IntegrationFormData = {
  type: IntegrationType;
  ip: string;
  port: number;
  description?: string;
};

interface IntegrationFormProps {
  mode: 'create' | 'update';
  integration?: Integration;

  formData: IntegrationFormData;
  config: IntegrationConfig;

  onChange: <K extends keyof IntegrationFormData>(
    field: K,
    value: IntegrationFormData[K],
  ) => void;

  onConfigChange: (value: Partial<IntegrationConfig>) => void;

  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export function IntegrationForm({
  mode,
  formData,
  config,
  onChange,
  onConfigChange,
  onSubmit,
  onCancel,
}: IntegrationFormProps) {
  const isCreate = mode === 'create';

  const typeLabel =
    integrationFull.find((i) => i.type === formData.type)?.label ??
    formData.type;

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <FormField id="type" label="Тип интеграции" required={isCreate}>
        {isCreate ? (
          <SimpleDropdownMenu
            value={formData.type}
            options={integrationFull.map((i) => ({
              label: i.label,
              value: i.type,
            }))}
            onSelect={(value) => onChange('type', value as IntegrationType)}
          />
        ) : (
          <input
            id="type"
            disabled
            className={sharedInputStyles}
            value={typeLabel}
          />
        )}
      </FormField>

      <FormField id="ip" label="ip">
        <input
          id="ip"
          className={sharedInputStyles}
          value={formData.ip}
          onChange={(e) => onChange('ip', e.target.value)}
        />
      </FormField>

      <FormField id="port" label="Port">
        <input
          id="port"
          type="number"
          className={sharedInputStyles}
          value={formData.port}
          onChange={(e) => onChange('port', Number(e.target.value))}
        />
      </FormField>

      {formData.type === 'fully_kiosk' && (
        <>
          <FormField id="login" label="Login">
            <input
              className={sharedInputStyles}
              value={(config as FullyKioskConfig).login}
              onChange={(e) => onConfigChange({ login: e.target.value })}
            />
          </FormField>

          <FormField id="password" label="Password">
            <input
              type="password"
              className={sharedInputStyles}
              value={(config as FullyKioskConfig).password}
              onChange={(e) => onConfigChange({ password: e.target.value })}
            />
          </FormField>
        </>
      )}

      <FormField id="description" label="Описание">
        <textarea
          rows={3}
          className={sharedInputStyles}
          value={formData.description ?? ''}
          onChange={(e) => onChange('description', e.target.value)}
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
