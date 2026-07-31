import { create } from 'zustand';

type CopyHandler = (sourceKioskId: number) => void;

interface ScenarioCopyState {
  isCopyMode: boolean;
  onCopyFromKiosk: CopyHandler | null;
  setIsCopyMode: (value: boolean) => void;
  toggleCopyMode: () => void;
  registerCopyHandler: (handler: CopyHandler | null) => void;
  reset: () => void;
}

export const useScenarioCopyStore = create<ScenarioCopyState>((set) => ({
  isCopyMode: false,
  onCopyFromKiosk: null,
  setIsCopyMode: (value) => set({ isCopyMode: value }),
  toggleCopyMode: () => set((s) => ({ isCopyMode: !s.isCopyMode })),
  registerCopyHandler: (handler) => set({ onCopyFromKiosk: handler }),
  reset: () => set({ isCopyMode: false, onCopyFromKiosk: null }),
}));
