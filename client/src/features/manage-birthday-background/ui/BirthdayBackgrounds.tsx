import * as Dialog from '@radix-ui/react-dialog';
import {
  buildBackgroundUrl,
  useDeleteBackground,
  useGetBackgrounds,
  useUploadBackground,
} from '@/entities/birthday-background';
import { useRef, useState } from 'react';
import { IconButton } from '@/shared/ui/common';
import { Cross1Icon, ResetIcon, UpdateIcon } from '@radix-ui/react-icons';

export function ManageBirthdayBackground() {
  const { data: backgrounds, isLoading } = useGetBackgrounds();
  const { mutate: deleteBackground } = useDeleteBackground();
  const { mutate: uploadBackground } = useUploadBackground();

  const [previewMonth, setPreviewMonth] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSlotClick = (month: number, fileName: string | null) => {
    if (fileName) {
      setPreviewMonth(month);
    } else {
      const input = fileInputRef.current;
      if (!input) return;

      input.dataset.month = `${previewMonth}`;
      input.click();
    }
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const month = Number(e.target.dataset.month);
    if (!file || !month) return;

    const formData = new FormData();
    formData.set('file', file);
    formData.set('month', month.toString());

    uploadBackground(formData);
    setPreviewMonth(null);
  };

  const handleReplace = () => {
    if (!previewMonth) return;

    const input = fileInputRef.current;
    if (!input) return;

    input.dataset.month = `${previewMonth}`;
    input.click();
  };

  const handleDelete = () => {
    if (!previewMonth) return;
    deleteBackground({ month: previewMonth });
    setPreviewMonth(null);
  };

  if (isLoading) {
    return <div className="text-sm opacity-50">Загрузка…</div>;
  }

  const current = backgrounds?.find((b) => b.monthNumber === previewMonth);
  const previewUrl = current?.fileName
    ? buildBackgroundUrl(current.fileName)
    : null;

  return (
    <>
      <div className="grid grid-cols-6 gap-4">
        {backgrounds?.map(({ monthNumber, monthName, fileName }) => {
          const url = fileName ? buildBackgroundUrl(fileName) : null;

          return (
            <div key={monthNumber} className="flex flex-col gap-1">
              <div className="text-[var(--meta-text)] text-sm">{monthName}</div>

              <button
                type="button"
                onClick={() => handleSlotClick(monthNumber, fileName)}
                className="relative flex aspect-[16/9] cursor-pointer items-center justify-center overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--bg-muted)] hover:bg-[var(--button-hover-bg)]"
              >
                {url ? (
                  <img
                    src={url}
                    alt={monthName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-[var(--meta-text)] text-sm">
                    Нет фона
                  </span>
                )}
              </button>
            </div>
          );
        })}
      </div>

      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        data-month=""
        className="hidden"
        onChange={handleUpload}
      />

      <Dialog.Root
        open={previewMonth !== null}
        onOpenChange={() => setPreviewMonth(null)}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50" />

          <Dialog.Content className="-translate-x-1/2 -translate-y-1/2 fixed top-1/2 left-1/2 w-[90vw] max-w-[1400px] overflow-hidden rounded-lg bg-[var(--card-bg)]">
            <Dialog.Description className="sr-only">
              Предпросмотр фона
            </Dialog.Description>

            <Dialog.Title className="sr-only">Предпросмотр</Dialog.Title>

            {previewUrl && (
              <img
                src={previewUrl}
                alt=""
                className="h-auto w-full object-contain"
              />
            )}

            <div className="flex justify-end gap-4 border-[var(--border)] border-t p-3">
              <IconButton
                onClick={handleDelete}
                tooltip="Удалить"
                icon={<Cross1Icon className="h-5 w-5 cursor-pointer" />}
              />
              <IconButton
                onClick={handleReplace}
                tooltip="Заменить"
                icon={<UpdateIcon className="h-5 w-5 cursor-pointer" />}
              />
              <IconButton
                onClick={() => setPreviewMonth(null)}
                tooltip="Закрыть"
                icon={<ResetIcon className="h-5 w-5 cursor-pointer" />}
              />
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
