import { create } from 'zustand';
import { trpcClient } from '@/shared/api';
import type { TickerConfig } from '..';

interface TickerConfigState {
  tickerConfig: TickerConfig | null;
  loading: boolean;
  error: string | null;
  initStore: (kioskId: number) => Promise<void>;
  setConfig: (config: TickerConfig) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useTickerConfigStore = create<TickerConfigState>()((set) => ({
  tickerConfig: null,
  loading: false,
  error: null,
  initStore: async (kioskId: number) => {
    set({ loading: true });
    try {
      const ticker = await trpcClient.tickerConfig.getByKioskId.query({
        kioskId,
      });
      set({
        tickerConfig: ticker,
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
  setConfig: (config) => set({ tickerConfig: config }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
}));
