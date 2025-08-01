import type { FeedConfig } from '@shared/types/feed.config';
import { create } from 'zustand';
import { trpcClient } from '@/shared/api/trpc';

interface FeedConfigState {
  feedConfig: FeedConfig;
  loading: boolean;
  error: string | null;
  initStore: () => Promise<void>;
  setConfig: (config: FeedConfig) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

const DEFAULT_CONFIG: FeedConfig = {
  cellsPerPage: 6,
  pagesCount: 1,
  carouselIntervalMs: 30000,
  id: 0,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const useFeedConfigStore = create<FeedConfigState>()((set) => ({
  feedConfig: DEFAULT_CONFIG,
  loading: false,
  error: null,
  initStore: async () => {
    set({ loading: true });
    try {
      const data = await trpcClient.feedConfig.getConfig.query();
      set({
        feedConfig: {
          ...data,
          createdAt: new Date(data.createdAt),
          updatedAt: new Date(data.updatedAt),
        },
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
  setConfig: (config) => set({ feedConfig: config }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
}));
