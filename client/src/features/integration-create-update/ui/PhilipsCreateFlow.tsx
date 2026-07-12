import { FormField, sharedInputStyles } from '@/shared/ui';
import { SimpleDropdownMenu } from '@/shared/ui/common';
import { PhilipsPairPanel } from './PhilipsPairPanel';
import type { IntegrationFormData } from '@/shared/ui';
import {
  integrationFull,
  type IntegrationType,
} from '@shared/types/integration';

interface PhilipsCreateFlowProps {
  formData: IntegrationFormData;

  onChange: <K extends keyof IntegrationFormData>(
    field: K,
    value: IntegrationFormData[K],
  ) => void;

  onTypeChange: (type: IntegrationType) => void;
  onClose: () => void;
}

export function PhilipsCreateFlow({
  formData,
  onChange,
  onTypeChange,
  onClose,
}: PhilipsCreateFlowProps) {
  const typeLabel =
    integrationFull.find((i) => i.type === formData.type)?.label ??
    formData.type;
  formData.type;

  return (
    <div className="space-y-4">
      <FormField id="type" label="Тип интеграции">
        {onTypeChange ? (
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

      <PhilipsPairPanel
        ip={formData.ip}
        isPaired={false}
        description={formData.description}
        onPaired={onClose}
      />
    </div>
  );
}
