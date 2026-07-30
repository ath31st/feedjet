import {
  useDeleteBackground,
  useGetBackgrounds,
  useUploadBackground,
} from '@/entities/birthday-background';
import { useRef, useState } from 'react';
import { toast } from 'sonner';

const BACKGROUND_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.bmp'];

function isAllowedBackground(file: File): boolean {
  const ext = file.name.toLowerCase().slice(file.name.lastIndexOf('.'));
  return BACKGROUND_EXTENSIONS.includes(ext);
}

export function useBackgroundManager() {
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

      input.dataset.month = `${month}`;
      input.click();
    }
  };

  const uploadBackgroundForMonth = (month: number, file: File) => {
    if (!isAllowedBackground(file)) {
      toast.error(`Неподдерживаемый формат: ${file.name}`);
      return;
    }

    const formData = new FormData();
    formData.set('file', file);
    formData.set('month', month.toString());

    uploadBackground(formData);
    setPreviewMonth(null);
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const month = Number(e.target.dataset.month);

    if (!file || !month) return;

    uploadBackgroundForMonth(month, file);
    e.target.value = '';
  };

  const handleDropFile = (month: number, file: File) => {
    uploadBackgroundForMonth(month, file);
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

  const closePreview = () => setPreviewMonth(null);

  return {
    backgrounds,
    isLoading,
    previewMonth,
    fileInputRef,
    handleSlotClick,
    handleUpload,
    handleDropFile,
    handleReplace,
    handleDelete,
    closePreview,
  };
}
