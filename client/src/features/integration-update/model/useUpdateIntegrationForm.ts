import { useState } from 'react';
import type {
  Integration,
  IntegrationType,
  IntegrationConfig,
  UpdateIntegration,
} from '@/entities/integration';

type FormData = {
  type: IntegrationType;
  host: string;
  port: number;
  description?: string;
};

export function useUpdateIntegrationForm(
  integration: Integration,
  onUpdate: (data: UpdateIntegration) => void,
  onClose: () => void,
) {
  const [formData, setFormData] = useState<FormData>({
    type: integration.type,
    host: integration.host,
    port: integration.port,
    description: integration.description ?? '',
  });

  const [config, setConfig] = useState<IntegrationConfig>(integration.config);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload: UpdateIntegration = {
      id: integration.id,
      type: integration.type,
    };

    if (formData.host !== integration.host) {
      payload.host = formData.host.trim();
    }

    if (formData.port !== integration.port) {
      payload.port = formData.port;
    }

    if (formData.description !== (integration.description ?? '')) {
      payload.description = formData.description?.trim();
    }

    if (formData.type !== integration.type) {
      payload.type = formData.type;
    }

    if (JSON.stringify(config) !== JSON.stringify(integration.config)) {
      payload.config = config;
    }

    onUpdate(payload);
    onClose();
  };

  const handleChange = <K extends keyof FormData>(
    field: K,
    value: FormData[K],
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

  const handleCancel = () => {
    onClose();
  };

  return {
    formData,
    config,
    handleChange,
    handleConfigChange,
    handleSubmit,
    handleCancel,
  };
}
