import { create } from 'zustand';
import { trpcClient } from '@/shared/api';
import type { TickerConfig } from '..';
import { TRPCClientError } from '@trpc/client';

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
      if (err instanceof TRPCClientError) {
        if (err.data?.code === 'NOT_FOUND') {
          set({
            tickerConfig: null,
            error: null,
            loading: false,
          });
          return;
        }
      }

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
