import { create } from 'zustand';
import type { UiConfig } from '..';
import { trpcClient } from '@/shared/api';

interface UiConfigState {
  uiConfig: UiConfig;
  error: string | null;
  loading: boolean;
  fetchUiConfig: (kioskId: number) => Promise<void>;
  setConfig: (config: UiConfig) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  reset: () => void;
}

const DEFAULT_CONFIG: UiConfig = {
  id: 0,
  theme: localStorage.getItem('theme') || 'dark',
  rotatingWidgets: ['feed', 'schedule'],
  autoSwitchIntervalMs: 30000,
  kioskId: 0,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const useUiConfigStore = create<UiConfigState>()((set) => ({
  uiConfig: DEFAULT_CONFIG,
  error: null,
  loading: false,
  fetchUiConfig: async (kioskId: number) => {
    set({ loading: true });
    try {
      const data = await trpcClient.uiConfig.getUiConfig.query({ kioskId });
      set({
        uiConfig: {
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
  setConfig: (config) => {
    if (config.theme) {
      localStorage.setItem('theme', config.theme);
    }
    set({ uiConfig: config });
  },
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
  reset: () => set({ uiConfig: DEFAULT_CONFIG }),
}));
