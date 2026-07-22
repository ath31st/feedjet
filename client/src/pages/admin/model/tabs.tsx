import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
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
import {
  BirthdaysManagement,
  HelpItems as birthdaysHelp,
} from '@/widgets/birthdays-management';
import {
  KioskWorkScheduleManagement,
  HelpItems as operatingHoursHelp,
} from '@/widgets/kiosk-work-schedule-management';
import { LogWidget, HelpItems as logsHelp } from '@/widgets/log';
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
import type { HelpItem } from '@/entities/help';

export type AdminTabContext = {
  kioskId: number;
  kioskSlug: string;
  offlineMode: boolean;
};

export type AdminTab = {
  value: string;
  label: string;
  icon: LucideIcon;
  kioskSelector?: boolean;
  when?: (ctx: Pick<AdminTabContext, 'offlineMode'>) => boolean;
  help: HelpItem[];
  render: (ctx: AdminTabContext) => ReactNode;
};

export const ADMIN_TABS: AdminTab[] = [
  {
    value: 'scenarios',
    label: 'Сценарии',
    icon: LayoutGrid,
    kioskSelector: true,
    help: scenariosHelp,
    render: ({ kioskId, kioskSlug }) => (
      <ScenariosManagementWidget kioskId={kioskId} kioskSlug={kioskSlug} />
    ),
  },
  {
    value: 'media-folder',
    label: 'Медиа контент',
    icon: Folder,
    help: mediaHelp,
    render: () => <MediaManagementWidget />,
  },
  {
    value: 'settings',
    label: 'Настройки оформления',
    icon: Settings,
    kioskSelector: true,
    help: appearanceHelp,
    render: ({ kioskId }) => <AppearanceSettingsWidget kioskId={kioskId} />,
  },
  {
    value: 'organization',
    label: 'Организация',
    icon: Building2,
    help: organizationHelp,
    render: () => <BrandingConfigManagementWidget />,
  },
  {
    value: 'schedule',
    label: 'Расписание мероприятий',
    icon: Calendar,
    help: scheduleHelp,
    render: () => (
      <div className="-mt-6">
        <ScheduleManagementWidget />
      </div>
    ),
  },
  {
    value: 'ticker',
    label: 'Бегущая строка',
    icon: Radio,
    kioskSelector: true,
    help: tickerHelp,
    render: ({ kioskId }) => <TickerManagementWidget kioskId={kioskId} />,
  },
  {
    value: 'rss',
    label: 'RSS ленты новостей',
    icon: Rss,
    kioskSelector: true,
    when: ({ offlineMode }) => !offlineMode,
    help: rssHelp,
    render: ({ kioskId }) => <RssManagementWidget kioskId={kioskId} />,
  },
  {
    value: 'birthdays',
    label: 'Дни рождения',
    icon: Cake,
    help: birthdaysHelp,
    render: () => <BirthdaysManagement />,
  },
  {
    value: 'kiosks',
    label: 'Конфигурации киосков',
    icon: Monitor,
    help: kiosksHelp,
    render: () => <KioskManagement />,
  },
  {
    value: 'devices',
    label: 'Устройства',
    icon: MonitorSmartphone,
    help: devicesHelp,
    render: () => <DeviceManagement />,
  },
  {
    value: 'integrations',
    label: 'Интеграции',
    icon: Link2Icon,
    help: integrationsHelp,
    render: () => <IntegrationManagement />,
  },
  {
    value: 'operating-hours',
    label: 'Режим работы',
    icon: Clock,
    kioskSelector: true,
    help: operatingHoursHelp,
    render: ({ kioskId }) => <KioskWorkScheduleManagement kioskId={kioskId} />,
  },
  {
    value: 'logs',
    label: 'Логи',
    icon: List,
    help: logsHelp,
    render: () => <LogWidget />,
  },
];

export function getVisibleAdminTabs(offlineMode: boolean): AdminTab[] {
  return ADMIN_TABS.filter((tab) => tab.when?.({ offlineMode }) ?? true);
}
