import { create } from 'zustand';

interface FeedCarouselState {
  startIndex: number;
  setStartIndex: (updater: number | ((prev: number) => number)) => void;
}

export const useFeedCarouselStore = create<FeedCarouselState>()((set) => ({
  startIndex: 0,

  setStartIndex: (updater) =>
    set((state) => ({
      startIndex:
        typeof updater === 'function'
          ? (updater as (prev: number) => number)(state.startIndex)
          : updater,
    })),
}));
