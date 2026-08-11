import * as Tabs from '@radix-ui/react-tabs';
import { AnimatePresence, motion } from 'framer-motion';

import { KioskSelectorWidget } from '@/widgets/kiosk-selector';
import { AdminHelpPanel } from '@/widgets/admin-help-panel';
import { useAdminHelp } from '@/features/admin-help-toggle';
import { AdminTabTrigger, SlideSlot, UnsavedChangesDialog, adminTabMotion } from '@/shared/ui';

import { getVisibleAdminTabs } from '../model/tabs';
import { useAdminPageGate } from '../model/useAdminPageGate';
import { useAdminTabLeaveGuard } from '../model/useAdminTabLeaveGuard';

export function AdminPage() {
  const { ready, kiosk, offlineMode } = useAdminPageGate();
  const { tab, handleTabChange, leaveDialog } = useAdminTabLeaveGuard();
  const isHelpEnabled = useAdminHelp((s) => s.enabled);

  if (!ready || !kiosk) {
    return null;
  }

  const adminTabs = getVisibleAdminTabs(offlineMode);
  const activeTab = adminTabs.find((t) => t.value === tab);
  const showKioskSelector = activeTab?.kioskSelector ?? false;
  const helpItems = isHelpEnabled ? (activeTab?.help ?? []) : [];
  const showHelp = isHelpEnabled && helpItems.length > 0;

  const tabContext = {
    kioskId: kiosk.id,
    kioskSlug: kiosk.slug,
    offlineMode,
  };

  return (
    <div className="p-6">
      <h1 className="mb-4 text-center font-bold text-3xl">
        Панель администратора
      </h1>

      <SlideSlot
        show={showKioskSelector}
        direction="up"
        className="mb-6 border-(--border) border-b-4"
      >
        <KioskSelectorWidget />
      </SlideSlot>

      <Tabs.Root value={tab} onValueChange={handleTabChange}>
        <div className="flex items-start gap-6">
          <Tabs.List
            className="scrollbar-hide flex w-60 shrink-0 flex-col"
            aria-label="Управление админ-панелью"
          >
            <div className="flex flex-col gap-2">
              {adminTabs.map((t) => (
                <AdminTabTrigger key={t.value} value={t.value} icon={t.icon}>
                  {t.label}
                </AdminTabTrigger>
              ))}
            </div>
          </Tabs.List>

          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              className="flex min-w-0 flex-1 gap-6"
              {...adminTabMotion}
            >
              <div className="min-w-0 flex-1">
                {activeTab?.render(tabContext) ?? null}
              </div>

              {showHelp && (
                <div className="flex w-60 shrink-0 flex-col">
                  <AdminHelpPanel helpItems={helpItems} />
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </Tabs.Root>

      <UnsavedChangesDialog
        open={leaveDialog.open}
        onStay={leaveDialog.onStay}
        onDiscard={leaveDialog.onDiscard}
      />
    </div>
  );
}
