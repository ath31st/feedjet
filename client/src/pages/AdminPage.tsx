import { LogoutButton } from '@/features/auth/ui/LogoutButton';
import { RssManagementWidget } from '@/widgets/rss-management';
import { AppearanceSettingsWidget } from '@/widgets/appearance-settings';
import { FeedWidgetSettings } from '@/widgets/feed-widget-settings';
import { KioskControlWidget } from '@/widgets/kiosk-control';

export function AdminPage() {
  return (
    <div className="flex w-screen flex-wrap gap-y-6 p-12">
      <div className="absolute top-6 right-12">
        <LogoutButton />
      </div>
      <div className="flex w-full gap-x-6">
        <RssManagementWidget />
        <AppearanceSettingsWidget />
      </div>

      <div className="flex w-full gap-x-6">
        <FeedWidgetSettings />
        <KioskControlWidget />
      </div>
    </div>
  );
}
