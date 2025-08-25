import { SettingsCard } from '@/shared/ui/SettingsCard';
import { VideoUpload } from '@/features/video-upload';
import { VideoList } from '@/features/video-list';
import { DiskUsageInfo } from './ui/DiskUsageInfo';

export function VideoContentManagementWidget() {
  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex w-full flex-row gap-6">
        <SettingsCard title="Использование диска" className="w-full md:w-1/2">
          <DiskUsageInfo />
        </SettingsCard>
        <SettingsCard title="Загрузка видео" className="w-full md:w-1/2">
          <VideoUpload />
        </SettingsCard>
      </div>
      <div className="flex w-full flex-row gap-6">
        <SettingsCard title="Доступные видео" className="w-full md:w-1/2">
          <VideoList />
        </SettingsCard>
      </div>
    </div>
  );
}
