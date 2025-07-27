import type { KioskConfig } from '@shared/types/kiosk.config';
import { create } from 'zustand';
import { trpcClient } from '../../../shared/api/trpc';

interface KioskConfigState {
  config: KioskConfig;
  loading: boolean;
  error: string | null;
  initStore: () => Promise<void>;
  setConfig: (config: KioskConfig) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

const DEFAULT_CONFIG: KioskConfig = {
  cellsPerPage: 6,
  id: 0,
  theme: 'dark',
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const useKioskConfigStore = create<KioskConfigState>()((set) => ({
  config: DEFAULT_CONFIG,
  loading: false,
  error: null,
  initStore: async () => {
    set({ loading: true });
    try {
      const data = await trpcClient.config.getMainConfig.query();
      set({
        config: {
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
  setConfig: (config) => set({ config }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
}));
