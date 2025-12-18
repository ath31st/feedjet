import { useState } from 'react';
import { integrationTypes, type NewIntegration } from '@/entities/integration';

export function useCreateIntegrationForm(
  onCreate: (data: NewIntegration) => void,
  onClose: () => void,
) {
  const [formData, setFormData] = useState<NewIntegration>({
    type: integrationTypes[0],
    login: '',
    password: '',
    description: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedData: NewIntegration = {
      type: formData.type,
      login: formData.login?.trim(),
      password: formData.description?.trim(),
      description: formData.description?.trim(),
    };

    onCreate(trimmedData);
    setFormData({
      type: integrationTypes[0],
      login: '',
      password: '',
      description: '',
    });
    onClose();
  };

  const handleChange = <K extends keyof NewIntegration>(
    field: K,
    value: NewIntegration[K],
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
