import { useState } from 'react';
import {
  integrationTypes,
  type IntegrationType,
  type IntegrationConfig,
  type NewIntegration,
  type FullyKioskConfig,
  type AdbConfig,
  type PhilipsJointspaceConfig,
  integrationFull,
} from '@/entities/integration';

type IntegrationFormData = {
  type: IntegrationType;
  ip: string;
  port: number;
  description?: string;
};

const getDefaultPort = (type: IntegrationType): number => {
  const found = integrationFull.find((i) => i.type === type);
  return found?.defaultPort ?? 0;
};

function getDefaultConfig(type: IntegrationType): IntegrationConfig {
  switch (type) {
    case 'fully_kiosk':
      return {
        login: '',
        password: '',
      };

    case 'adb':
      return {};

    case 'philips_jointspace':
      return {
        deviceId: '',
        authKey: '',
      };
  }
}

function createDefaultForm(ip: string | null): IntegrationFormData {
  const defaultType = integrationTypes[0];

  return {
    type: defaultType,
    ip: ip ?? '',
    port: getDefaultPort(defaultType),
    description: '',
  };
}

export function useCreateIntegrationForm(
  ip: string | null,
  onCreate: (data: NewIntegration) => void,
  onClose: () => void,
) {
  const [formData, setFormData] = useState<IntegrationFormData>(
    createDefaultForm(ip),
  );

  const [config, setConfig] = useState<IntegrationConfig>(
    getDefaultConfig(integrationTypes[0]),
  );

  const reset = () => {
    setFormData(createDefaultForm(ip));
    setConfig(getDefaultConfig(integrationTypes[0]));
  };

  const handleChange = <K extends keyof IntegrationFormData>(
    field: K,
    value: IntegrationFormData[K],
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleConfigChange = (value: Partial<IntegrationConfig>) => {
    setConfig(
      (prev) =>
        ({
          ...prev,
          ...value,
        }) as IntegrationConfig,
    );
  };

  const handleTypeChange = (type: IntegrationType) => {
    setFormData((prev) => ({
      ...prev,
      type,
      port: getDefaultPort(type),
    }));

    setConfig(getDefaultConfig(type));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const base = {
      ip: formData.ip.trim(),
      port: formData.port,
      description: formData.description?.trim() || undefined,
    };

    if (formData.type === 'fully_kiosk') {
      onCreate({
        ...base,
        type: 'fully_kiosk',
        config: config as FullyKioskConfig,
      });
    }

    if (formData.type === 'adb') {
      onCreate({
        ...base,
        type: 'adb',
        config: config as AdbConfig,
      });
    }

    if (formData.type === 'philips_jointspace') {
      onCreate({
        ...base,
        type: 'philips_jointspace',
        config: config as PhilipsJointspaceConfig,
      });
    }

    reset();
    onClose();
  };

  const handleCancel = () => {
    reset();
    onClose();
  };

  return {
    formData,
    config,
    handleChange,
    handleConfigChange,
    handleTypeChange,
    handleSubmit,
    handleCancel,
  };
}
