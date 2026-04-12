import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AdminHelpState {
  enabled: boolean;
  setEnabled: (value: boolean) => void;
}

export const useAdminHelp = create<AdminHelpState>()(
  persist(
    (set) => ({
      enabled: true,
      setEnabled: (enabled) => set({ enabled }),
    }),
    {
      name: 'admin-help-enabled',
    },
  ),
);
