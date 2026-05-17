import * as Tabs from '@radix-ui/react-tabs';
import { RssManagementWidget } from '@/widgets/rss-management';
import { AppearanceSettingsWidget } from '@/widgets/appearance-settings';
import { AdminTabTrigger } from '@/shared/ui';
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
import { HelpItems as birthdaysHelp } from '@/widgets/birthdays-management';
import { HelpItems as kiosksHelp } from '@/widgets/kiosk-management';
import { HelpItems as appearanceHelp } from '@/widgets/appearance-settings';
import { HelpItems as operatingHoursHelp } from '@/widgets/kiosk-work-schedule-management';
import { HelpItems as rssHelp } from '@/widgets/rss-management';
import { HelpItems as videoHelp } from '@/widgets/video-content-management';
import { HelpItems as imageHelp } from '@/widgets/image-content-management';
import { TickerManagementWidget } from '@/widgets/ticker-management';
import { ScenariosManagementWidget } from '@/widgets/scenarios-management';
import { MediaManagementWidget } from '@/widgets/media-management';

export function AdminPage() {
  const kioskId = useKioskStore((s) => s.currentKiosk.id);
  const isKioskLoading = useKioskStore((s) => s.loading);

  if (isKioskLoading || kioskId === -1) {
    return null;
  }

  return (
    <div className="p-6">
      <div className="absolute top-6 right-12">
        <Logout />
      </div>

      <h1 className="mb-4 text-center font-bold text-3xl">
        Панель администратора
      </h1>

      <div className="mb-6 flex justify-center border-(--border) border-b-4">
        <KioskSelectorWidget />
      </div>

      <Tabs.Root
        defaultValue="settings"
        orientation="vertical"
        className="w-full"
      >
        <div className="flex flex-row items-start gap-6">
          <Tabs.List
            className="scrollbar-hide flex w-60 flex-col"
            aria-label="Управление админ-панелью"
          >
            <div className="flex flex-col gap-2">
              <AdminTabTrigger value="scenarios">Сценарии</AdminTabTrigger>
              <AdminTabTrigger value="media-folder">
                Медиа контент
              </AdminTabTrigger>
              <AdminTabTrigger value="settings">
                Настройки оформления
              </AdminTabTrigger>
              <AdminTabTrigger value="schedule">
                Расписание мероприятий
              </AdminTabTrigger>
              <AdminTabTrigger value="ticker">Бегущая строка</AdminTabTrigger>
              <AdminTabTrigger value="rss">RSS ленты новостей</AdminTabTrigger>
              <AdminTabTrigger value="birthdays">Дни рождения</AdminTabTrigger>
              <AdminTabTrigger value="kiosks">
                Конфигурации киосков
              </AdminTabTrigger>
              <AdminTabTrigger value="operating-hours">
                Режим работы
              </AdminTabTrigger>
              <AdminTabTrigger value="logs">Логи</AdminTabTrigger>
            </div>
          </Tabs.List>

          <div className="w-full">
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

          <div className="flex w-60 flex-col">
            <Tabs.Content value="settings">
              <AdminHelpPanel helpItems={appearanceHelp} />
            </Tabs.Content>
            <Tabs.Content value="rss">
              <AdminHelpPanel helpItems={rssHelp} />
            </Tabs.Content>
            <Tabs.Content value="schedule">
              <AdminHelpPanel helpItems={[]} />
            </Tabs.Content>
            <Tabs.Content value="video">
              <AdminHelpPanel helpItems={videoHelp} />
            </Tabs.Content>
            <Tabs.Content value="image">
              <AdminHelpPanel helpItems={imageHelp} />
            </Tabs.Content>
            <Tabs.Content value="birthdays">
              <AdminHelpPanel helpItems={birthdaysHelp} />
            </Tabs.Content>
            <Tabs.Content value="kiosks">
              <AdminHelpPanel helpItems={kiosksHelp} />
            </Tabs.Content>
            <Tabs.Content value="operating-hours">
              <AdminHelpPanel helpItems={operatingHoursHelp} />
            </Tabs.Content>
            <Tabs.Content value="logs">
              <AdminHelpPanel helpItems={[]} />
            </Tabs.Content>
          </div>
        </div>
      </Tabs.Root>
    </div>
  );
}
