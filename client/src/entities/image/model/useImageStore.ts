import { create } from 'zustand';
import type { KioskImageInfo } from '..';
import { trpcClient } from '@/shared/api';

type ImageStore = {
  images: KioskImageInfo[];
  currentImage: KioskImageInfo | null;
  loading: boolean;
  error: string | null;
  initStore: (kioskId: number) => Promise<void>;
  setImages: (images: KioskImageInfo[]) => void;
  setCurrentImage: (image: KioskImageInfo | null) => void;
  resetPlaylist: () => void;
  nextImage: () => void;
};

export const useImageStore = create<ImageStore>((set) => ({
  images: [],
  currentImage: null,
  loading: false,
  error: null,
  initStore: async (kioskId) => {
    set({ loading: true });
    try {
      const data = await trpcClient.image.listActiveImages.query({ kioskId });
      set({
        images: data,
        currentImage: data.length > 0 ? data[0] : null,
        error: null,
        loading: false,
      });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : 'Unknown error',
        loading: false,
      });
    }
  },
  setImages: (images) =>
    set((state) => {
      const exists =
        state.currentImage &&
        images.some((i) => i.fileName === state.currentImage?.fileName);

      return {
        images: images,
        currentImage: exists ? state.currentImage : (images[0] ?? null),
      };
    }),
  setCurrentImage: (image) => set({ currentImage: image }),
  nextImage: () =>
    set((state) => {
      if (!state.currentImage || !state.images.length) {
        return { currentImage: null };
      }

      const index = state.images.findIndex(
        (i) => i.fileName === state.currentImage?.fileName,
      );

      if (index === -1) {
        return { currentImage: null };
      }

      const nextIndex = index + 1;

      if (nextIndex >= state.images.length) {
        return { currentImage: null };
      }

      return { currentImage: state.images[nextIndex] };
    }),
  resetPlaylist: () =>
    set((state) => ({
      currentImage: state.images.length > 0 ? state.images[0] : null,
    })),
}));
