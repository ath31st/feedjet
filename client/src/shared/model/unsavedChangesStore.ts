import { create } from 'zustand';
import { useEffect } from 'react';

export type UnsavedSourceId =
  | 'scenarios'
  | 'ticker'
  | 'birthdays-transform'
  | 'birthdays-list'
  | 'organization';

type LeaveAction = () => void;

interface UnsavedChangesState {
  sources: Partial<Record<UnsavedSourceId, boolean>>;
  pendingLeave: LeaveAction | null;
  setDirty: (sourceId: UnsavedSourceId, dirty: boolean) => void;
  clear: (sourceId: UnsavedSourceId) => void;
  hasUnsavedChanges: () => boolean;
  requestLeave: (action: LeaveAction) => void;
  confirmLeave: () => void;
  cancelLeave: () => void;
}

export const useUnsavedChangesStore = create<UnsavedChangesState>(
  (set, get) => ({
    sources: {},
    pendingLeave: null,

    setDirty: (sourceId, dirty) =>
      set((state) => ({
        sources: { ...state.sources, [sourceId]: dirty },
      })),

    clear: (sourceId) =>
      set((state) => {
        const sources = { ...state.sources };
        delete sources[sourceId];
        return { sources };
      }),

    hasUnsavedChanges: () => Object.values(get().sources).some(Boolean),

    requestLeave: (action) => {
      if (!get().hasUnsavedChanges()) {
        action();
        return;
      }
      set({ pendingLeave: action });
    },

    confirmLeave: () => {
      const action = get().pendingLeave;
      set({ pendingLeave: null });
      action?.();
    },

    cancelLeave: () => set({ pendingLeave: null }),
  }),
);

export function useSyncUnsavedSource(
  sourceId: UnsavedSourceId,
  dirty: boolean,
) {
  const setDirty = useUnsavedChangesStore((s) => s.setDirty);
  const clear = useUnsavedChangesStore((s) => s.clear);

  useEffect(() => {
    setDirty(sourceId, dirty);
  }, [sourceId, dirty, setDirty]);

  useEffect(() => {
    return () => clear(sourceId);
  }, [sourceId, clear]);
}
