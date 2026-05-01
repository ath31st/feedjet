import { create } from 'zustand';
import { trpcClient } from '@/shared/api';
import type { TickerConfig } from '..';

interface TickerConfigState {
  tickerConfig: TickerConfig | null;
  loading: boolean;
  error: string | null;
  fetchTickerConfig: (kioskId: number) => Promise<void>;
  setConfig: (config: TickerConfig) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useTickerConfigStore = create<TickerConfigState>()((set) => ({
  tickerConfig: null,
  loading: false,
  error: null,
  fetchTickerConfig: async (kioskId: number) => {
    set({ loading: true });
    try {
      const data = await trpcClient.tickerConfig.getByKioskId.query({
        kioskId,
      });
      set({
        tickerConfig: {
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
  setConfig: (config) => set({ tickerConfig: config }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
}));
