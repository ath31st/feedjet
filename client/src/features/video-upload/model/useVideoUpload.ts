import { useUploadVideo } from '@/entities/video';

export function useVideoUpload() {
  const { mutate: uploadFile, isPending } = useUploadVideo();

  const upload = (files: File[]) => {
    if (!files.length) return;

    files.forEach((file) => {
      const formData = new FormData();
      formData.set('file', file);
      formData.set('filename', file.name);

      uploadFile(formData);
    });
  };

  return { upload, isPending };
}
