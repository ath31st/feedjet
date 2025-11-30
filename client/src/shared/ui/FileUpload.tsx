import { useRef, useState } from 'react';
import { CommonButton } from '@/shared/ui/common';

interface FileUploadProps {
  onUpload: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  isPending?: boolean;
  buttonText?: string;
  dropText?: string;
  loadingText?: string;
}

export function FileUpload({
  onUpload,
  accept = '*/*',
  multiple = true,
  isPending = false,
  buttonText = 'Выбрать файл',
  dropText = 'Перетащите файлы сюда',
  loadingText = 'Идет загрузка...',
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleButtonClick = () => inputRef.current?.click();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    onUpload(Array.from(e.target.files));
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    onUpload(files);
  };

  return (
    <div className="flex flex-col gap-2">
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleInputChange}
        className="hidden"
      />

      <CommonButton
        type="button"
        onClick={handleButtonClick}
        disabled={isPending}
      >
        {isPending ? loadingText : buttonText}
      </CommonButton>

      {/** biome-ignore lint/a11y/noStaticElementInteractions: no need to add a11y  */}
      <div
        className={`flex h-30 items-center justify-center rounded-lg border-2 border-dashed ${
          dragOver
            ? 'border-[var(--border)] bg-[var(--button-hover-bg)]'
            : 'border-[var(--border)]'
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        <span className="text-[var(--meta-text)] text-sm">
          {isPending ? loadingText : dropText}
        </span>
      </div>
    </div>
  );
}
