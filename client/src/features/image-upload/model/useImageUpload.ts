import { useUploadImage } from '@/entities/image';

export function useImageUpload() {
  const { mutate: uploadFile, isPending } = useUploadImage();

  const upload = (files: File[]) => {
    files.forEach((file) => {
      const formData = new FormData();

      formData.set('file', file);
      formData.set('filename', file.name);
      uploadFile(formData);
    });
  };

  return { upload, isPending };
}
