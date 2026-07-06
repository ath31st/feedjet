import * as Tabs from '@radix-ui/react-tabs';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import { Logout } from '@/features/auth';
import { LogWidget } from '@/widgets/log';
import { AdminHelpPanel } from '@/widgets/admin-help-panel';

// import { HelpItems as organizationHelp } from '@/widgets/organization-management';
// import { HelpItems as userHelp } from '@/widgets/user-management';

import { useAdminHelp } from '@/features/admin-help-toggle';
import { AdminTabTrigger } from '@/shared/ui';

import { List, Users } from 'lucide-react';
import type { HelpItem } from '@/entities/help';

export function SuperAdminPage() {
  const [tab, setTab] = useState('organizations');
  const isHelpEnabled = useAdminHelp((s) => s.enabled);
  const helpMap: Record<string, HelpItem[]> = {
    // organizations: organizationHelp,
    // users: userHelp,
  };

  const helpItems = isHelpEnabled ? (helpMap[tab] ?? []) : [];
  const showHelp = isHelpEnabled && helpItems.length > 0;

  const tabs = [
    {
      value: 'organizations',
      label: 'Организации',
      icon: List,
    },
    {
      value: 'users',
      label: 'Пользователи',
      icon: Users,
    },
    { value: 'logs', label: 'Логи', icon: List },
  ];

  const renderTab = () => {
    switch (tab) {
      //   case 'organizations':
      //     return <OrganizationManagementWidget />;

      //   case 'users':
      //     return <UserManagementWidget />;

      case 'logs':
        return <LogWidget />;

      default:
        return null;
    }
  };

  return (
    <div className="p-6">
      <div className="absolute top-6 right-12">
        <Logout />
      </div>

      <h1 className="mb-4 text-center font-bold text-3xl">
        Панель супер администратора
      </h1>

      <div className="mb-6 border-(--border) border-b-4" />

      <Tabs.Root value={tab} onValueChange={setTab}>
        <div className="flex items-start gap-6">
          <Tabs.List
            className="scrollbar-hide flex w-60 shrink-0 flex-col"
            aria-label="Управление админ-панелью"
          >
            <div className="flex flex-col gap-2">
              {tabs.map((t) => (
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
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <div className="min-w-0 flex-1">{renderTab()}</div>

              {showHelp && (
                <div className="flex w-60 shrink-0 flex-col">
                  <AdminHelpPanel helpItems={helpItems} />
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </Tabs.Root>
    </div>
  );
}
