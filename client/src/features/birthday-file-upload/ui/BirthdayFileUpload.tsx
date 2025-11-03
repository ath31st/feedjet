import { useRef } from 'react';
import { CommonButton } from '@/shared/ui/common';
import { useUploadBirthdays } from '@/entities/birthday';

export function BirthdayFileUpload() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { mutate: uploadFile, isPending } = useUploadBirthdays();

  const handleButtonClick = () => {
    inputRef.current?.click();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.set('file', file);

    uploadFile(formData);

    e.target.value = '';
  };

  return (
    <div className="flex flex-col gap-2">
      <input
        ref={inputRef}
        type="file"
        accept=".txt,.csv,.odt,.docx"
        onChange={handleInputChange}
        className="hidden"
      />

      <CommonButton
        type="button"
        onClick={handleButtonClick}
        disabled={isPending}
      >
        {isPending ? 'Обработка файла...' : 'Выбрать файл'}
      </CommonButton>

      {isPending && (
        <span className="text-[var(--meta-text)] text-sm">
          Файл загружается и обрабатывается...
        </span>
      )}
    </div>
  );
}
