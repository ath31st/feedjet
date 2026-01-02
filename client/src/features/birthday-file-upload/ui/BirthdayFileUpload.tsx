import { useRef, useState } from 'react';
import {
  CommonButton,
  PopoverHint,
  SimpleDropdownMenu,
} from '@/shared/ui/common';
import { useUploadBirthdays } from '@/entities/birthday';
import { DATE_FORMATS } from '@/shared/constant';
import { NumberSliderSelector } from '@/shared/ui';

export function BirthdayFileUpload() {
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

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex flex-row items-center gap-4">
        <div className="flex w-1/3 flex-col gap-1">
          <div className="flex items-center gap-2">
            <span>Формат даты:</span>
            <PopoverHint
              content={
                <>
                  <p className="mb-1 text-[var(--meta-text)]">
                    Примеры форматов:
                  </p>
                  <ul className="list-disc pl-4">
                    {DATE_FORMATS.map((f) => (
                      <li key={f.label}>
                        <b>{f.label}</b> → {f.example}
                      </li>
                    ))}
                  </ul>
                </>
              }
            />
          </div>

          <SimpleDropdownMenu
            value={dateFormat ?? 'Стандартный'}
            options={DATE_FORMATS.map((f) => {
              return {
                label: f.label,
                value: f.label,
              };
            })}
            onSelect={(label) =>
              setDateFormat(label === 'Стандартный' ? undefined : label)
            }
          />
        </div>

        <div className="w-2/3">
          <NumberSliderSelector
            label="Не удалять ДР последних N дней"
            value={lastDays}
            min={0}
            max={15}
            setValue={setLastDays}
          />
        </div>
      </div>

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
