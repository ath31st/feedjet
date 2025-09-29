import { LogoutButton } from '@/features/auth/ui/LogoutButton';
import { RssManagementWidget } from '@/widgets/rss-management';
import { AppearanceSettingsWidget } from '@/widgets/appearance-settings';
import { FeedWidgetSettings } from '@/widgets/feed-widget-settings';
import { KioskControlWidget } from '@/widgets/kiosk-control';
import * as Tabs from '@radix-ui/react-tabs';
import { AdminTabTrigger } from '@/shared/ui/AdminTabTrigger';
import { ScheduleManagementWidget } from '@/widgets/schedule-management';
import { VideoContentManagementWidget } from '@/widgets/video-content-management';
import { KioskManagement } from '@/widgets/kiosk-management';

export function AdminPage() {
  return (
    <div className="p-6">
      <div className="absolute top-6 right-12">
        <LogoutButton />
      </div>

      <h1 className="mb-2 text-center font-bold text-2xl">
        Панель администратора
      </h1>

      <Tabs.Root defaultValue="settings" className="w-full">
        <Tabs.List
          className="flex border-[color:var(--border)] border-b-2"
          aria-label="Управление админ-панелью"
        >
          <AdminTabTrigger value="settings">Настройки</AdminTabTrigger>
          <AdminTabTrigger value="schedule">Расписание</AdminTabTrigger>
          <AdminTabTrigger value="video">Видео</AdminTabTrigger>
        </Tabs.List>

        <Tabs.Content value="settings" className="flex flex-col gap-6">
          <KioskManagement />
          <div className="flex w-full gap-6">
            <AppearanceSettingsWidget />
            <FeedWidgetSettings />
          </div>

          <div className="flex w-full gap-6">
            <RssManagementWidget />
            <KioskControlWidget />
          </div>
        </Tabs.Content>

        <Tabs.Content value="schedule">
          <ScheduleManagementWidget />
        </Tabs.Content>

        <Tabs.Content value="video">
          <div className="mt-6 flex w-full gap-6">
            <VideoContentManagementWidget />
          </div>
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
}
