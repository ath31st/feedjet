import { FeedAddForm } from '@/features/rss-management';
import { FeedList } from '@/features/rss-management';
import { SettingsCard } from '@/shared/ui/SettingsCard';

export function RssManagementWidget() {
  return (
    <SettingsCard title="Управление RSS-лентами" className="mt-6 w-full">
      <FeedAddForm />
      <FeedList />
    </SettingsCard>
  );
}
