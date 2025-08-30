import { create } from 'zustand';
import type { VideoMetadata } from '..';
import { trpcClient } from '@/shared/api/trpc';

type VideoStore = {
  videos: VideoMetadata[];
  currentVideo: VideoMetadata | null;
  loading: boolean;
  error: string | null;
  initStore: () => Promise<void>;
  setVideos: (videos: VideoMetadata[]) => void;
  setCurrentVideo: (video: VideoMetadata | null) => void;
  nextVideo: () => void;
};

export const useVideoStore = create<VideoStore>((set) => ({
  videos: [],
  currentVideo: null,
  loading: false,
  error: null,
  initStore: async () => {
    set({ loading: true });
    try {
      const data = await trpcClient.videoFile.listActiveVideos.query();
      set({
        videos: data,
        currentVideo: data.length > 0 ? data[0] : null,
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
  setVideos: (videos) =>
    set((state) => {
      const exists =
        state.currentVideo &&
        videos.some((v) => v.fileName === state.currentVideo?.fileName);

      return {
        videos,
        currentVideo: exists ? state.currentVideo : (videos[0] ?? null),
      };
    }),
  setCurrentVideo: (video) => set({ currentVideo: video }),
  nextVideo: () =>
    set((state) => {
      if (!state.videos.length) return { currentVideo: null };
      if (!state.currentVideo) return { currentVideo: state.videos[0] };

      const index = state.videos.findIndex(
        (v) => v.fileName === state.currentVideo?.fileName,
      );
      const nextIndex = (index + 1) % state.videos.length;
      return { currentVideo: state.videos[nextIndex] };
    }),
}));
