import { useState } from 'react';

import { useUnsavedChangesStore } from '@/shared/model';

export function useAdminTabLeaveGuard(initialTab = 'scenarios') {
  const [tab, setTab] = useState(initialTab);
  const requestLeave = useUnsavedChangesStore((s) => s.requestLeave);
  const pendingLeave = useUnsavedChangesStore((s) => s.pendingLeave);
  const confirmLeave = useUnsavedChangesStore((s) => s.confirmLeave);
  const cancelLeave = useUnsavedChangesStore((s) => s.cancelLeave);

  const handleTabChange = (nextTab: string) => {
    if (nextTab === tab) return;
    requestLeave(() => setTab(nextTab));
  };

  return {
    tab,
    handleTabChange,
    leaveDialog: {
      open: pendingLeave !== null,
      onStay: cancelLeave,
      onDiscard: confirmLeave,
    },
  };
}
