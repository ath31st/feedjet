import { create } from 'zustand';
import type { Kiosk } from '..';
import { trpcClient } from '@/shared/api';

interface KioskState {
  currentKiosk: Kiosk | null;
  loading: boolean;
  error: string | null;

  fetchKioskBySlug: (slug: string) => Promise<void>;
  setCurrentKiosk: (kiosk: Kiosk | null) => void;
  clearError: () => void;
  reset: () => void;
}

export const useKioskStore = create<KioskState>()((set, _get) => ({
  currentKiosk: null,
  loading: false,
  error: null,

  fetchKioskBySlug: async (slug: string) => {
    set({ loading: true, error: null });
    try {
      const kiosk = await trpcClient.kiosk.getBySlug.query({ slug });
      set({ currentKiosk: kiosk, loading: false });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : 'Failed to fetch kiosk',
        loading: false,
      });
    }
  },

  setCurrentKiosk: (kiosk) => {
    set({ currentKiosk: kiosk });
  },

  clearError: () => {
    set({ error: null });
  },

  reset: () => {
    set({
      currentKiosk: null,
      loading: false,
      error: null,
    });
  },
}));
