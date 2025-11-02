import { useState } from 'react';
import type { NewBirthday } from '@/entities/birthday';

export function useCreateBirthdayForm(onCreate: (data: NewBirthday) => void) {
  const [formData, setFormData] = useState<NewBirthday>({
    fullName: '',
    department: '',
    birthDate: new Date(),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedData: NewBirthday = {
      fullName: formData.fullName.trim(),
      department: formData.department?.trim() || undefined,
      birthDate: formData.birthDate,
    };

    onCreate(trimmedData);

    setFormData({ fullName: '', department: '', birthDate: new Date() });
  };

  const handleChange = (field: keyof NewBirthday, value: string | Date) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCancel = () => {
    setFormData({ fullName: '', department: '', birthDate: new Date() });
  };

  return {
    formData,
    handleSubmit,
    handleChange,
    handleCancel,
  };
}
