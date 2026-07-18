import * as Tabs from '@radix-ui/react-tabs';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import {
  RssManagementWidget,
  HelpItems as rssHelp,
} from '@/widgets/rss-management';
import {
  AppearanceSettingsWidget,
  HelpItems as appearanceHelp,
} from '@/widgets/appearance-settings';
import {
  ScheduleManagementWidget,
  HelpItems as scheduleHelp,
} from '@/widgets/schedule-management';
import {
  KioskManagement,
  HelpItems as kiosksHelp,
} from '@/widgets/kiosk-management';
import { KioskSelectorWidget } from '@/widgets/kiosk-selector';
import { Logout } from '@/features/auth';
import {
  BirthdaysManagement,
  HelpItems as birthdaysHelp,
} from '@/widgets/birthdays-management';
import { useKioskStore } from '@/entities/kiosk';
import {
  KioskWorkScheduleManagement,
  HelpItems as operatingHoursHelp,
} from '@/widgets/kiosk-work-schedule-management';
import { LogWidget, HelpItems as logsHelp } from '@/widgets/log';
import { AdminHelpPanel } from '@/widgets/admin-help-panel';
import {
  TickerManagementWidget,
  HelpItems as tickerHelp,
} from '@/widgets/ticker-management';
import {
  ScenariosManagementWidget,
  HelpItems as scenariosHelp,
} from '@/widgets/scenarios-management';
import {
  MediaManagementWidget,
  HelpItems as mediaHelp,
} from '@/widgets/media-management';
import {
  IntegrationManagement,
  HelpItems as integrationsHelp,
} from '@/widgets/integration-management';
import {
  DeviceManagement,
  HelpItems as devicesHelp,
} from '@/widgets/device-management';
import {
  BrandingConfigManagementWidget,
  HelpItems as organizationHelp,
} from '@/widgets/branding-config-management';

import { useAdminHelp } from '@/features/admin-help-toggle';
import { AdminTabTrigger, SlideSlot } from '@/shared/ui';

import {
  LayoutGrid,
  Settings,
  Calendar,
  Radio,
  Rss,
  Cake,
  Monitor,
  Clock,
  List,
  Folder,
  Link2Icon,
  MonitorSmartphone,
  Building2,
} from 'lucide-react';
import type { HelpItem } from '@/entities/help';

export function AdminPage() {
  const kiosk = useKioskStore((s) => s.currentKiosk);
  const isKioskLoading = useKioskStore((s) => s.loading);

  const [tab, setTab] = useState('scenarios');
  const isHelpEnabled = useAdminHelp((s) => s.enabled);

  if (isKioskLoading || !kiosk) {
    return null;
  }

  const kioskId = kiosk.id;
  const kioskSlug = kiosk.slug;

  const helpMap: Record<string, HelpItem[]> = {
    scenarios: scenariosHelp,
    'media-folder': mediaHelp,
    settings: appearanceHelp,
    organization: organizationHelp,
    schedule: scheduleHelp,
    ticker: tickerHelp,
    rss: rssHelp,
    birthdays: birthdaysHelp,
    kiosks: kiosksHelp,
    devices: devicesHelp,
    integrations: integrationsHelp,
    'operating-hours': operatingHoursHelp,
    logs: logsHelp,
  };

  const helpItems = isHelpEnabled ? (helpMap[tab] ?? []) : [];
  const showHelp = isHelpEnabled && helpItems.length > 0;

  const adminTabs = [
    {
      value: 'scenarios',
      label: 'Сценарии',
      icon: LayoutGrid,
      kioskSelector: true,
    },
    {
      value: 'media-folder',
      label: 'Медиа контент',
      icon: Folder,
      kioskSelector: false,
    },
    {
      value: 'settings',
      label: 'Настройки оформления',
      icon: Settings,
      kioskSelector: true,
    },
    {
      value: 'organization',
      label: 'Организация',
      icon: Building2,
    },
    {
      value: 'schedule',
      label: 'Расписание мероприятий',
      icon: Calendar,
      kioskSelector: false,
    },
    {
      value: 'ticker',
      label: 'Бегущая строка',
      icon: Radio,
      kioskSelector: true,
    },
    {
      value: 'rss',
      label: 'RSS ленты новостей',
      icon: Rss,
      kioskSelector: true,
    },
    {
      value: 'birthdays',
      label: 'Дни рождения',
      icon: Cake,
      kioskSelector: false,
    },
    {
      value: 'kiosks',
      label: 'Конфигурации киосков',
      icon: Monitor,
      kioskSelector: false,
    },
    {
      value: 'devices',
      label: 'Устройства',
      icon: MonitorSmartphone,
      kioskSelector: false,
    },
    {
      value: 'integrations',
      label: 'Интеграции',
      icon: Link2Icon,
      kioskSelector: false,
    },
    {
      value: 'operating-hours',
      label: 'Режим работы',
      icon: Clock,
      kioskSelector: true,
    },
    { value: 'logs', label: 'Логи', icon: List, kioskSelector: false },
  ];

  const activeTab = adminTabs.find((t) => t.value === tab);
  const showKioskSelector = activeTab?.kioskSelector ?? false;

  const renderTab = () => {
    switch (tab) {
      case 'scenarios':
        return (
          <ScenariosManagementWidget kioskId={kioskId} kioskSlug={kioskSlug} />
        );

      case 'media-folder':
        return <MediaManagementWidget />;

      case 'settings':
        return <AppearanceSettingsWidget kioskId={kioskId} />;

      case 'organization':
        return <BrandingConfigManagementWidget />;

      case 'schedule':
        return (
          <div className="-mt-6">
            <ScheduleManagementWidget />
          </div>
        );

      case 'ticker':
        return <TickerManagementWidget kioskId={kioskId} />;

      case 'rss':
        return <RssManagementWidget kioskId={kioskId} />;

      case 'birthdays':
        return <BirthdaysManagement />;

      case 'kiosks':
        return <KioskManagement />;

      case 'devices':
        return <DeviceManagement />;

      case 'integrations':
        return <IntegrationManagement />;

      case 'operating-hours':
        return <KioskWorkScheduleManagement kioskId={kioskId} />;

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
        Панель администратора
      </h1>

      <SlideSlot
        show={showKioskSelector}
        direction="up"
        className="mb-6 border-(--border) border-b-4"
      >
        <KioskSelectorWidget />
      </SlideSlot>

      <Tabs.Root value={tab} onValueChange={setTab}>
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
