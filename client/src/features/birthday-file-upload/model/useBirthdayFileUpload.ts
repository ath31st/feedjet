import { useUploadBirthdays } from '@/entities/birthday';
import { useRef, useState } from 'react';

export const useBirthdayFileUpload = () => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { mutate: uploadFile, isPending } = useUploadBirthdays();
  const [dateFormat, setDateFormat] = useState<string | undefined>(undefined);
  const [lastDays, setLastDays] = useState(0);

  const handleButtonClick = () => {
    inputRef.current?.click();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.set('file', file);
    formData.set('lastDays', lastDays.toString());
    if (dateFormat) formData.set('dateFormat', dateFormat);

    uploadFile(formData);

    e.target.value = '';
  };

  return {
    inputRef,
    handleButtonClick,
    handleInputChange,
    isPending,
    dateFormat,
    setDateFormat,
    lastDays,
    setLastDays,
  };
};
