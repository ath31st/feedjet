import { create } from 'zustand';
import { trpcClient } from '@/shared/api';
import type { Scenario } from '..';

interface ScenarioState {
  scenario: Scenario | null;
  loading: boolean;
  error: string | null;
  initStore: (kioskId: number) => Promise<void>;
  setScenario: (config: Scenario) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useScenarioStore = create<ScenarioState>()((set) => ({
  scenario: null,
  loading: false,
  error: null,
  initStore: async (kioskId: number) => {
    set({ loading: true });
    try {
      const scenario = await trpcClient.scenario.getByKiosk.query({
        kioskId,
      });
      set({
        scenario: scenario,
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
  setScenario: (scenario) => set({ scenario: scenario }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
}));
