import { useState } from 'react';
import type { Kiosk, UpdateKiosk } from '@/entities/kiosk';

export function useUpdateKioskForm(
  kiosk: Kiosk,
  onUpdate: (data: UpdateKiosk) => void,
  onClose: () => void,
) {
  const [formData, setFormData] = useState<UpdateKiosk>({
    name: kiosk.name,
    description: kiosk.description ?? '',
    location: kiosk.location ?? '',
    isActive: kiosk.isActive,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload: UpdateKiosk = {
      name: formData.name !== kiosk.name ? formData.name?.trim() : undefined,
      description:
        formData.description !== kiosk.description
          ? formData.description?.trim()
          : undefined,
      location:
        formData.location !== kiosk.location
          ? formData.location?.trim()
          : undefined,
      isActive:
        formData.isActive !== kiosk.isActive ? formData.isActive : undefined,
    };

    onUpdate(payload);
    onClose();
  };

  const handleChange = (field: keyof UpdateKiosk, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCancel = () => onClose();

  return { formData, handleSubmit, handleChange, handleCancel };
}
