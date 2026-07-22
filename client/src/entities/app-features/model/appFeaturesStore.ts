import { create } from 'zustand';
import type { AppFeatures } from '@shared/types/app.features';
import { trpcClient } from '@/shared/api';

interface AppFeaturesState extends AppFeatures {
  loading: boolean;
  initialized: boolean;
  fetchFeatures: () => Promise<void>;
}

export const useAppFeaturesStore = create<AppFeaturesState>()((set) => ({
  offlineMode: false,
  loading: false,
  initialized: false,

  fetchFeatures: async () => {
    set({ loading: true });
    try {
      const data = await trpcClient.app.getFeatures.query();
      set({
        offlineMode: data.offlineMode,
        loading: false,
        initialized: true,
      });
    } catch {
      set({
        offlineMode: false,
        loading: false,
        initialized: true,
      });
    }
  },
}));
