import { create } from 'zustand';
import type { BrandingConfig } from '..';
import { trpcClient } from '@/shared/api';

interface BrandingState {
  config: BrandingConfig | null;
  loading: boolean;
  error: string | null;

  fetchConfig(): Promise<void>;
  setConfig(config: BrandingConfig): void;
  setLoading: (loading: boolean) => void;
  clearError(): void;
}

export const useBrandingConfigStore = create<BrandingState>()((set, _get) => ({
  config: null,
  loading: false,
  error: null,

  fetchConfig: async () => {
    set({ loading: true, error: null });
    try {
      const config = await trpcClient.brandingConfig.getCurrentConfig.query();
      set({ config: config, loading: false });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : 'Failed to fetch kiosk',
        loading: false,
      });
    }
  },

  setConfig: (config: BrandingConfig) => {
    set({ config });
  },

  setLoading: (loading) => {
    set({ loading });
  },

  clearError: () => {
    set({ error: null });
  },
}));
