import { FileUpload } from '@/shared/ui/FileUpload';
import { useVideoUpload } from '../model/useVideoUpload';

export function VideoUpload() {
  const { upload, isPending } = useVideoUpload();

  return (
    <FileUpload
      onUpload={upload}
      accept="video/*"
      multiple
      isPending={isPending}
      buttonText="Выбрать видео"
      dropText="Перетащите видеофайлы сюда"
      loadingText="Идет загрузка..."
    />
  );
}
