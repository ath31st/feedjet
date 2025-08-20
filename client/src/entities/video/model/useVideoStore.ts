import { create } from 'zustand';

type Video = {
  id: number;
  name: string;
  url: string;
};

type VideoStore = {
  videos: Video[];
  addVideo: (video: Video) => void;
  removeVideo: (id: number) => void;
};

export const useVideoStore = create<VideoStore>((set) => ({
  videos: [],
  addVideo: (video) => set((s) => ({ videos: [...s.videos, video] })),
  removeVideo: (id) =>
    set((s) => ({ videos: s.videos.filter((v) => v.id !== id) })),
}));
