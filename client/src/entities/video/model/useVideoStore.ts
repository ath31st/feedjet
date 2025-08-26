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
};

export const useVideoStore = create<VideoStore>((set) => ({
  videos: [],
  currentVideo: null,
  loading: false,
  error: null,
  initStore: async () => {
    set({ loading: true });
    try {
      const data = await trpcClient.videoFile.listFiles.query();
      set({ videos: data, error: null, loading: false });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : 'Unknown error',
        loading: false,
      });
    }
  },
  setVideos: (videos) => set({ videos }),
  setCurrentVideo: (video) => set({ currentVideo: video }),
}));
