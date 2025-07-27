import { trpcClient } from '../../../shared/api/trpc/trpc';
import { create } from 'zustand';
import type { FeedItem } from '@shared/types/feed';

interface RssFeedState {
  feeds: FeedItem[];
  loading: boolean;
  error: string | null;
  initStore: () => Promise<void>;
  setFeeds: (feeds: FeedItem[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useRssFeedStore = create<RssFeedState>()((set) => ({
  feeds: [],
  loading: false,
  error: null,
  initStore: async () => {
    set({ loading: true });
    try {
      const data = await trpcClient.rssParser.parseLatestFeedIitems.query();
      set({ feeds: data, error: null, loading: false });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : 'Unknown error',
        loading: false,
      });
    }
  },
  setFeeds: (feeds) => set({ feeds }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
}));
