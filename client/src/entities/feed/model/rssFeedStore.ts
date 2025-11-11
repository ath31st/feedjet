import { create } from 'zustand';
import type { FeedItem } from '..';

interface RssFeedState {
  feeds: FeedItem[];
  loading: boolean;
  error: string | null;
  setFeeds: (feeds: FeedItem[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useRssFeedStore = create<RssFeedState>()((set) => ({
  feeds: [],
  loading: false,
  error: null,
  setFeeds: (feeds) => set({ feeds }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
}));
