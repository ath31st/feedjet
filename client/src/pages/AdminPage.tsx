import { LogoutButton } from '@/features/auth/ui/LogoutButton';
import { RssManagementWidget } from '@/widgets/rss-management';
import { AppearanceSettingsWidget } from '@/widgets/appearance-settings';
import { FeedWidgetSettings } from '@/widgets/feed-widget-settings';
import { KioskControlWidget } from '@/widgets/kiosk-control';
import * as Tabs from '@radix-ui/react-tabs';
import { AdminTabTrigger } from '@/shared/ui/AdminTabTrigger';

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
          className="mb-6 flex border-[color:var(--border)] border-b-2"
          aria-label="Управление админ-панелью"
        >
          <AdminTabTrigger value="settings">Настройки</AdminTabTrigger>
          <AdminTabTrigger value="schedule">Расписание</AdminTabTrigger>
        </Tabs.List>

        <Tabs.Content value="settings" className="flex flex-col gap-6">
          <div className="flex w-full gap-6">
            <RssManagementWidget />
            <AppearanceSettingsWidget />
          </div>

          <div className="flex w-full gap-6">
            <FeedWidgetSettings />
            <KioskControlWidget />
          </div>
        </Tabs.Content>

        <Tabs.Content value="schedule">
          <div
            className="rounded-xl border p-6 text-center"
            style={{
              borderColor: 'var(--border)',
            }}
          >
            <h2 className="mb-4 font-semibold text-xl">Расписание</h2>
            <p>Функция в разработке</p>
          </div>
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
}
