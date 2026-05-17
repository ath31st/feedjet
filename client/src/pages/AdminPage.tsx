import * as Tabs from '@radix-ui/react-tabs';
import { useState } from 'react';

import { RssManagementWidget } from '@/widgets/rss-management';
import { AppearanceSettingsWidget } from '@/widgets/appearance-settings';
import { ScheduleManagementWidget } from '@/widgets/schedule-management';
import { VideoContentManagementWidget } from '@/widgets/video-content-management';
import { KioskManagement } from '@/widgets/kiosk-management';
import { KioskSelectorWidget } from '@/widgets/kiosk-selector';
import { Logout } from '@/features/auth';
import { BirthdaysManagement } from '@/widgets/birthdays-management';
import { ImageContentManagementWidget } from '@/widgets/image-content-management';
import { useKioskStore } from '@/entities/kiosk';
import { KioskWorkScheduleManagement } from '@/widgets/kiosk-work-schedule-management';
import { LogWidget } from '@/widgets/log';
import { AdminHelpPanel } from '@/widgets/admin-help-panel';
import { TickerManagementWidget } from '@/widgets/ticker-management';
import { ScenariosManagementWidget } from '@/widgets/scenarios-management';
import { MediaManagementWidget } from '@/widgets/media-management';

import { HelpItems as birthdaysHelp } from '@/widgets/birthdays-management';
import { HelpItems as kiosksHelp } from '@/widgets/kiosk-management';
import { HelpItems as appearanceHelp } from '@/widgets/appearance-settings';
import { HelpItems as operatingHoursHelp } from '@/widgets/kiosk-work-schedule-management';
import { HelpItems as rssHelp } from '@/widgets/rss-management';
import { HelpItems as videoHelp } from '@/widgets/video-content-management';
import { HelpItems as imageHelp } from '@/widgets/image-content-management';

import { useAdminHelp } from '@/features/admin-help-toggle';
import { AdminTabTrigger, SlideSlot } from '@/shared/ui';
import type { HelpItem } from '@/entities/help';

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
} from 'lucide-react';

export function AdminPage() {
  const kioskId = useKioskStore((s) => s.currentKiosk.id);
  const isKioskLoading = useKioskStore((s) => s.loading);

  const [tab, setTab] = useState('scenarios');
  const isHelpEnabled = useAdminHelp((s) => s.enabled);

  if (isKioskLoading || kioskId === -1) {
    return null;
  }

  const helpMap: Record<string, HelpItem[]> = {
    settings: appearanceHelp,
    rss: rssHelp,
    video: videoHelp,
    image: imageHelp,
    birthdays: birthdaysHelp,
    kiosks: kiosksHelp,
    'operating-hours': operatingHoursHelp,
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
      kioskSelector: false,
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
      value: 'operating-hours',
      label: 'Режим работы',
      icon: Clock,
      kioskSelector: true,
    },
    { value: 'logs', label: 'Логи', icon: List, kioskSelector: false },
  ] as const;

  const activeTab = adminTabs.find((t) => t.value === tab);
  const showKioskSelector = activeTab?.kioskSelector ?? false;

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
          <div className="flex flex-1 gap-6">
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

            <div className="min-w-0 flex-1">
              <Tabs.Content value="scenarios">
                <ScenariosManagementWidget />
              </Tabs.Content>

              <Tabs.Content value="media-folder">
                <MediaManagementWidget />
              </Tabs.Content>

              <Tabs.Content value="settings">
                <AppearanceSettingsWidget kioskId={kioskId} />
              </Tabs.Content>

              <Tabs.Content value="rss">
                <RssManagementWidget kioskId={kioskId} />
              </Tabs.Content>

              <Tabs.Content className="-mt-6" value="schedule">
                <ScheduleManagementWidget />
              </Tabs.Content>

              <Tabs.Content value="ticker">
                <TickerManagementWidget kioskId={kioskId} />
              </Tabs.Content>

              <Tabs.Content value="video">
                <VideoContentManagementWidget kioskId={kioskId} />
              </Tabs.Content>

              <Tabs.Content value="image">
                <ImageContentManagementWidget kioskId={kioskId} />
              </Tabs.Content>

              <Tabs.Content value="birthdays">
                <BirthdaysManagement />
              </Tabs.Content>

              <Tabs.Content value="kiosks">
                <KioskManagement />
              </Tabs.Content>

              <Tabs.Content value="operating-hours">
                <KioskWorkScheduleManagement kioskId={kioskId} />
              </Tabs.Content>

              <Tabs.Content value="logs">
                <LogWidget />
              </Tabs.Content>
            </div>
          </div>

          {showHelp && (
            <div className="flex w-60 flex-col">
              <AdminHelpPanel helpItems={helpItems} />
            </div>
          )}
        </div>
      </Tabs.Root>
    </div>
  );
}
