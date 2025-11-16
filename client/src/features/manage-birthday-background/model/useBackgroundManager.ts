import {
  useDeleteBackground,
  useGetBackgrounds,
  useUploadBackground,
} from '@/entities/birthday-background';
import { useRef, useState } from 'react';

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

  const closePreview = () => setPreviewMonth(null);

  return {
    backgrounds,
    isLoading,
    previewMonth,
    fileInputRef,
    handleSlotClick,
    handleUpload,
    handleReplace,
    handleDelete,
    closePreview,
  };
}
