import { useCallback, useState, type DragEvent } from 'react';
import { toast } from 'sonner';
import { useUploadImage } from '@/entities/image';
import { useUploadVideo } from '@/entities/video';

interface UploadingFile {
  name: string;
  progress: number;
}

const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.bmp'];

const VIDEO_EXTENSIONS = ['.mp4', '.webm', '.mkv', '.avi', '.mov'];

interface UseMediaUploadParams {
  folderId: number | null;
}

function hasFilePayload(e: DragEvent): boolean {
  return Array.from(e.dataTransfer.types).includes('Files');
}

export function useMediaUpload({ folderId }: UseMediaUploadParams) {
  const [uploading, setUploading] = useState<UploadingFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const uploadImage = useUploadImage();
  const uploadVideo = useUploadVideo();

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
            await uploadImage.mutateAsync(fd as unknown as FormData);
          } else {
            await uploadVideo.mutateAsync(fd as unknown as FormData);
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
    [folderId, uploadImage, uploadVideo],
  );

  const handleDragOver = useCallback((e: DragEvent) => {
    if (!hasFilePayload(e)) return;
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: DragEvent) => {
    if (!hasFilePayload(e)) return;
    e.preventDefault();
    e.stopPropagation();

    const next = e.relatedTarget;
    if (next instanceof Node && e.currentTarget.contains(next)) return;

    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: DragEvent) => {
      if (!hasFilePayload(e)) return;
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);

      if (e.dataTransfer.files.length > 0) {
        void handleUploadFiles(e.dataTransfer.files);
      }
    },
    [handleUploadFiles],
  );

  return {
    uploading,
    isDragOver,
    handleUploadFiles,
    handleDragOver,
    handleDragLeave,
    handleDrop,
  };
}
