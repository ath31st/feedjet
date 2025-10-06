import { useUploadVideo } from '@/entities/video';

export function useVideoUpload() {
  const { mutate: uploadFile, isPending } = useUploadVideo();

  const uploadFiles = (files: File[]) => {
    if (!files.length) return;

    files.forEach((file) => {
      const formData = new FormData();
      formData.set('file', file);
      formData.set('filename', file.name);

      uploadFile(formData);
    });
  };

  return { uploadFiles, isPending };
}
