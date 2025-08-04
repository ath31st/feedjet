import { create } from 'zustand';

interface FeedCarouselState {
  startIndex: number;
  setStartIndex: (i: number) => void;
}

export const useFeedCarouselStore = create<FeedCarouselState>()((set) => ({
  startIndex: 0,
  setStartIndex: (i) => set({ startIndex: i }),
}));
