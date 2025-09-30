import { useState } from 'react';
import type { NewKiosk } from '@/entities/kiosk';

export function useCreateKioskForm(
  onCreate: (data: NewKiosk) => void,
  onClose: () => void,
) {
  const [formData, setFormData] = useState<NewKiosk>({
    name: '',
    slug: '',
    description: '',
    location: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedData: NewKiosk = {
      name: formData.name.trim(),
      slug: formData.slug.trim(),
      description: formData.description?.trim() || '',
      location: formData.location?.trim() || '',
    };

    onCreate(trimmedData);
    setFormData({ name: '', slug: '', description: '', location: '' });
    onClose();
  };

  const handleChange = (field: keyof NewKiosk, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCancel = () => {
    setFormData({ name: '', slug: '', description: '', location: '' });
    onClose();
  };

  return {
    formData,
    handleSubmit,
    handleChange,
    handleCancel,
  };
}
