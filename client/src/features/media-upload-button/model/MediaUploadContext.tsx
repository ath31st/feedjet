import { createContext, useContext, type ReactNode } from 'react';
import type { useMediaUpload } from './useMediaUpload';

type MediaUploadContextValue = ReturnType<typeof useMediaUpload>;

const MediaUploadContext = createContext<MediaUploadContextValue | null>(null);

export function MediaUploadContextProvider({
  value,
  children,
}: {
  value: MediaUploadContextValue;
  children: ReactNode;
}) {
  return (
    <MediaUploadContext.Provider value={value}>
      {children}
    </MediaUploadContext.Provider>
  );
}

export function useMediaUploadContext() {
  const ctx = useContext(MediaUploadContext);
  if (!ctx) {
    throw new Error('useMediaUploadContext must be used within MediaUploadArea');
  }
  return ctx;
}
