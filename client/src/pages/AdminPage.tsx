import { RssManagementWidget } from '@/widgets/rss-management';
import { AppearanceSettingsWidget } from '@/widgets/appearance-settings';
import * as Tabs from '@radix-ui/react-tabs';
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

      <Tabs.Root defaultValue="settings" className="w-full">
        <Tabs.List
          className="flex border-(--border) border-b-2"
          aria-label="Управление админ-панелью"
        >
          <div className="ml-56">
            <AdminTabTrigger value="settings">
              Настройки виджетов
            </AdminTabTrigger>
            <AdminTabTrigger value="schedule">
              Расписание мероприятий
            </AdminTabTrigger>
            <AdminTabTrigger value="rss">RSS ленты новостей</AdminTabTrigger>
            <AdminTabTrigger value="video">Видео контент</AdminTabTrigger>
            <AdminTabTrigger value="image">Изображения</AdminTabTrigger>
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

        <div className="mt-6 flex w-full flex-row gap-6">
          <KioskSelectorWidget />

          <div className="w-full">
            <Tabs.Content value="settings" className="flex flex-col gap-6">
              <AppearanceSettingsWidget kioskId={kioskId} />
            </Tabs.Content>

            <Tabs.Content value="rss">
              <RssManagementWidget kioskId={kioskId} />
            </Tabs.Content>

            <Tabs.Content className="-mt-6" value="schedule">
              <ScheduleManagementWidget />
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
      </Tabs.Root>
    </div>
  );
}
