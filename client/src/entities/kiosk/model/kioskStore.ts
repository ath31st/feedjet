import { create } from 'zustand';
import type { Kiosk } from '..';
import { trpcClient } from '@/shared/api';

interface KioskState {
  currentKiosk: Kiosk;
  loading: boolean;
  error: string | null;

  fetchKioskBySlug: (slug: string) => Promise<void>;
  setCurrentKiosk: (kiosk: Kiosk) => void;
  setDefaultKiosk: () => Promise<void>;
  clearError: () => void;
}

const stubKiosk: Kiosk = {
  id: -1,
  name: 'Loading...',
  slug: '',
  isActive: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const useKioskStore = create<KioskState>()((set, _get) => ({
  currentKiosk: stubKiosk,
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

  setDefaultKiosk: async () => {
    set({ loading: true, error: null });
    try {
      const kiosks = await trpcClient.kiosk.getAll.query();
      const defaultKiosk =
        kiosks.find((k) => k.name === 'Default') ?? kiosks[0] ?? null;
      set({ currentKiosk: defaultKiosk, loading: false });
    } catch (err) {
      set({
        error:
          err instanceof Error ? err.message : 'Failed to initialize kiosk',
        loading: false,
      });
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));
