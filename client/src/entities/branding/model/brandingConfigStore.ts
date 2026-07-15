import { create } from 'zustand';
import { buildLogoUrl, type BrandingConfig } from '..';
import { trpcClient } from '@/shared/api';
import defaultLogo from '@/shared/assets/default_logo.png';
import type { Logo } from '..';

interface BrandingState {
  config: BrandingConfig | null;
  logoUrl: string;
  loading: boolean;
  loadingLogo: boolean;
  error: string | null;

  fetchConfig(): Promise<void>;
  fetchLogo(): Promise<void>;
  setConfig(config: BrandingConfig): void;
  setLogo(logo: Logo | null): void;
  setLoading: (loading: boolean) => void;
  clearError(): void;
}

export const useBrandingConfigStore = create<BrandingState>()((set, _get) => ({
  config: null,
  logoUrl: defaultLogo,
  loading: false,
  loadingLogo: false,
  error: null,

  fetchLogo: async () => {
    set({ loadingLogo: true, error: null });
    try {
      const logo = await trpcClient.logo.getLogo.query();
      set({
        logoUrl: logo ? buildLogoUrl(logo.fileName) : defaultLogo,
        loadingLogo: false,
      });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : 'Failed to fetch logo',
        loadingLogo: false,
      });
    }
  },

  setLogo: (logo: Logo | null) => {
    set({ logoUrl: logo ? buildLogoUrl(logo.fileName) : defaultLogo });
  },

  fetchConfig: async () => {
    set({ loading: true, error: null });
    try {
      const config = await trpcClient.brandingConfig.getCurrentConfig.query();
      set({ config: config, loading: false });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : 'Failed to fetch config',
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
