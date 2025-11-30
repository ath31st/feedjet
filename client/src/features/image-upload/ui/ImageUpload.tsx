import { FileUpload } from '@/shared/ui';
import { useImageUpload } from '../model/useImageUpload';

export function ImageUpload() {
  const { upload, isPending } = useImageUpload();

  return (
    <FileUpload
      onUpload={upload}
      accept="image/*"
      multiple
      isPending={isPending}
      buttonText="Выбрать изображения"
      dropText="Перетащите изображения сюда"
      loadingText="Идет загрузка..."
    />
  );
}
