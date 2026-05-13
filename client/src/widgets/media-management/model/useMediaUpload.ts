import { useCallback, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { queryClient, trpcWithProxy } from '@/shared/api';
import { toast } from 'sonner';

interface UploadingFile {
  name: string;
  progress: number;
}

const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.bmp'];

const VIDEO_EXTENSIONS = ['.mp4', '.webm', '.mkv', '.avi', '.mov'];

interface UseMediaUploadParams {
  folderId: number | null;
}

export function useMediaUpload({ folderId }: UseMediaUploadParams) {
  const [uploading, setUploading] = useState<UploadingFile[]>([]);

  const invalidateMedia = () => {
    queryClient.invalidateQueries({
      queryKey: trpcWithProxy.mediaFolder.listMedia.queryKey({
        folderId,
      }),
    });

    queryClient.invalidateQueries({
      queryKey: trpcWithProxy.mediaFolder.stats.queryKey(),
    });
  };

  const uploadImageMut = useMutation(
    trpcWithProxy.image.uploadFile.mutationOptions({
      onSuccess: invalidateMedia,
    }),
  );

  const uploadVideoMut = useMutation(
    trpcWithProxy.videoFile.uploadFile.mutationOptions({
      onSuccess: invalidateMedia,
    }),
  );

  const handleUploadFiles = useCallback(
    async (files: FileList | File[]) => {
      const arr = Array.from(files);

      for (const file of arr) {
        const ext = file.name.toLowerCase().slice(file.name.lastIndexOf('.'));

        const isImage = IMAGE_EXTENSIONS.includes(ext);
        const isVideo = VIDEO_EXTENSIONS.includes(ext);

        if (!isImage && !isVideo) {
          toast.error(`Неподдерживаемый формат: ${file.name}`);
          continue;
        }

        setUploading((prev) => [
          ...prev,
          {
            name: file.name,
            progress: 0,
          },
        ]);

        const interval = setInterval(() => {
          setUploading((prev) =>
            prev.map((u) =>
              u.name === file.name && u.progress < 90
                ? {
                    ...u,
                    progress: u.progress + 15,
                  }
                : u,
            ),
          );
        }, 200);

        const fd = new FormData();

        fd.set('file', file);
        fd.set('filename', file.name);

        if (folderId !== null) {
          fd.set('folderId', String(folderId));
        }

        try {
          if (isImage) {
            await uploadImageMut.mutateAsync(fd as unknown as FormData);
          } else {
            await uploadVideoMut.mutateAsync(fd as unknown as FormData);
          }

          clearInterval(interval);

          setUploading((prev) =>
            prev.map((u) =>
              u.name === file.name
                ? {
                    ...u,
                    progress: 100,
                  }
                : u,
            ),
          );

          setTimeout(() => {
            setUploading((prev) => prev.filter((u) => u.name !== file.name));
          }, 700);
        } catch {
          clearInterval(interval);

          setUploading((prev) => prev.filter((u) => u.name !== file.name));
        }
      }
    },
    [folderId, uploadImageMut, uploadVideoMut],
  );

  return {
    uploading,
    handleUploadFiles,
  };
}
