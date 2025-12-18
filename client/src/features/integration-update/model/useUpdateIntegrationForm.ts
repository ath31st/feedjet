import { useState } from 'react';
import {
  integrationTypes,
  type Integration,
  type UpdateIntegration,
} from '@/entities/integration';

export function useUpdateIntegrationForm(
  integration: Integration,
  onUpdate: (data: UpdateIntegration) => void,
  onClose: () => void,
) {
  const [formData, setFormData] = useState<UpdateIntegration>({
    type: integrationTypes[0],
    login: integration.login ?? '',
    password: integration.passwordEnc ? '*****' : '',
    description: integration.description ?? '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedData: UpdateIntegration = {
      type: formData.type,
      login:
        formData.login !== integration.login
          ? formData.login?.trim()
          : undefined,
      password: formData.description?.trim(),
      description:
        formData.description !== integration.description
          ? formData.description?.trim()
          : undefined,
    };

    onUpdate(trimmedData);
    setFormData({
      type: integrationTypes[0],
      login: '',
      password: '',
      description: '',
    });
    onClose();
  };

  const handleChange = <K extends keyof UpdateIntegration>(
    field: K,
    value: UpdateIntegration[K],
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCancel = () => {
    setFormData({
      type: integrationTypes[0],
      login: '',
      password: '',
      description: '',
    });
    onClose();
  };

  return {
    formData,
    handleSubmit,
    handleChange,
    handleCancel,
  };
}
