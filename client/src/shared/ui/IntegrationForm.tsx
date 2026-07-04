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
import { useState } from 'react';

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
  onTypeChange?: (value: IntegrationType) => void;

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
  onTypeChange,
}: IntegrationFormProps) {
  const isCreate = mode === 'create';
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const typeLabel =
    integrationFull.find((i) => i.type === formData.type)?.label ??
    formData.type;

  const handlePasswordChange = (value: string) => {
    onConfigChange({ password: value });
    const isEmptyInUpdate = mode === 'update' && !value && !passwordConfirm;

    if (!isEmptyInUpdate && passwordConfirm && value !== passwordConfirm) {
      setPasswordError('Пароли не совпадают');
    } else {
      setPasswordError('');
    }
  };

  const handlePasswordConfirmChange = (value: string) => {
    setPasswordConfirm(value);
    const password = (config as FullyKioskConfig).password;
    const isEmptyInUpdate = mode === 'update' && !password && !value;

    if (!isEmptyInUpdate && password && value !== password) {
      setPasswordError('Пароли не совпадают');
    } else {
      setPasswordError('');
    }
  };

  const handlePasswordConfirmBlur = () => {
    const password = (config as FullyKioskConfig).password;
    const isEmptyInUpdate = mode === 'update' && !password && !passwordConfirm;

    if (!isEmptyInUpdate && password && passwordConfirm !== password) {
      setPasswordError('Пароли не совпадают');
    } else {
      setPasswordError('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.type === 'fully_kiosk') {
      const password = (config as FullyKioskConfig).password;
      const shouldValidate = mode === 'create' || passwordConfirm !== '';

      if (shouldValidate && password !== passwordConfirm) {
        setPasswordError('Пароли не совпадают');
        return;
      }
    }

    onSubmit(e);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <FormField id="type" label="Тип интеграции" required={isCreate}>
        {isCreate && onTypeChange ? (
          <SimpleDropdownMenu
            value={formData.type}
            options={integrationFull.map((i) => ({
              label: i.label,
              value: i.type,
            }))}
            onSelect={(value) => onTypeChange(value as IntegrationType)}
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

      <FormField id="ip" label="IP адрес">
        <input
          id="ip"
          className={sharedInputStyles}
          value={formData.ip}
          onChange={(e) => onChange('ip', e.target.value)}
        />
      </FormField>

      <FormField id="port" label="Порт">
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
          <FormField id="login" label="Логин">
            <input
              className={sharedInputStyles}
              value={(config as FullyKioskConfig).login}
              onChange={(e) => onConfigChange({ login: e.target.value })}
            />
          </FormField>

          <FormField id="password" label="Пароль">
            <input
              type="password"
              className={sharedInputStyles}
              value={(config as FullyKioskConfig).password}
              onChange={(e) => handlePasswordChange(e.target.value)}
            />
          </FormField>

          <FormField
            id="password-confirm"
            label="Подтверждение пароля"
            error={passwordError}
          >
            <input
              type="password"
              className={sharedInputStyles}
              value={passwordConfirm}
              onChange={(e) => handlePasswordConfirmChange(e.target.value)}
              onBlur={handlePasswordConfirmBlur}
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
