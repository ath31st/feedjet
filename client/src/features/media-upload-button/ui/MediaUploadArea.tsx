import type { ReactNode } from 'react';
import { useMediaUpload } from '../model/useMediaUpload';
import { MediaUploadContextProvider } from '../model/MediaUploadContext';

interface MediaUploadAreaProps {
  folderId: number | null;
  children: ReactNode;
}

export function MediaUploadArea({ folderId, children }: MediaUploadAreaProps) {
  const upload = useMediaUpload({ folderId });

  return (
    <MediaUploadContextProvider value={upload}>
      {children}
    </MediaUploadContextProvider>
  );
}
