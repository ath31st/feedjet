import { useRef, useState } from 'react';
import { CommonButton } from '@/shared/ui/common/CommonButton';
import { useUploadVideo } from '@/entities/video/api/useVideo';

export function VideoUpload() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const { mutate: uploadFile, isPending } = useUploadVideo();

  const handleFiles = (files: File[]) => {
    if (!files.length) return;
    console.log('Выбраны файлы:', files);
    files.forEach((file) => {
      const formData = new FormData();
      formData.set('file', file);
      formData.set('filename', file.name);

      uploadFile(formData);
    });
  };

  const handleButtonClick = () => {
    inputRef.current?.click();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    handleFiles(Array.from(e.target.files));
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);

    if (e.dataTransfer.items) {
      const files = Array.from(e.dataTransfer.items)
        .filter((item) => item.kind === 'file')
        .map((item) => item.getAsFile())
        .filter((file): file is File => Boolean(file));

      handleFiles(files);
    } else if (e.dataTransfer.files) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <input
        ref={inputRef}
        type="file"
        accept="video/*"
        multiple
        onChange={handleInputChange}
        className="hidden"
      />

      <CommonButton
        type="button"
        onClick={handleButtonClick}
        disabled={isPending}
      >
        {isPending ? 'Идет загрузка...' : 'Выбрать видео'}
      </CommonButton>

      {/** biome-ignore lint/a11y/noStaticElementInteractions: no need to add a11y  */}
      <div
        className={`flex h-40 items-center justify-center rounded border-2 border-dashed ${
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
        {isPending ? (
          <span className="text-[var(--meta-text)] text-sm">
            Идет загрузка...
          </span>
        ) : (
          <span className="text-[var(--meta-text)] text-sm">
            Перетащите видеофайлы сюда
          </span>
        )}
      </div>
    </div>
  );
}
