import { useState } from 'react';
import type { NewBirthday } from '@/entities/birthday';
import { toast } from 'sonner';

type FormData = Omit<NewBirthday, 'birthDate'> & { birthDate: string };

export function useCreateBirthdayForm(onCreate: (data: NewBirthday) => void) {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    department: '',
    birthDate: new Date().toISOString().split('T')[0],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const birthDate = new Date(formData.birthDate);
    if (birthDate.getTime() > Date.now()) {
      toast.error('Дата рождения не может быть в будущем');
      return;
    }

    if (birthDate.getTime() < new Date('1900-01-01').getTime()) {
      toast.error('Дата рождения не может быть в раньше чем 1900 год');
      return;
    }

    const trimmedData: NewBirthday = {
      fullName: formData.fullName.trim(),
      department: formData.department?.trim() || undefined,
      birthDate: birthDate,
    };

    onCreate(trimmedData);

    setFormData({
      fullName: '',
      department: '',
      birthDate: new Date().toISOString().split('T')[0],
    });
  };

  const handleChange = (field: keyof NewBirthday, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCancel = () => {
    setFormData({
      fullName: '',
      department: '',
      birthDate: new Date().toISOString().split('T')[0],
    });
  };

  return {
    formData,
    handleSubmit,
    handleChange,
    handleCancel,
  };
}
