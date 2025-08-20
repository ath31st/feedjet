import { SettingsCard } from '@/shared/ui/SettingsCard';
import { VideoUpload } from '@/features/video-upload';
import { VideoList } from '@/features/video-list';

export function VideoContentManagementWidget() {
  return (
    <div className="flex w-full flex-row gap-6">
      <SettingsCard title="Доступные видео" className="w-full md:w-1/2">
        <div className="flex flex-col gap-4">
          <VideoList />
        </div>
      </SettingsCard>
      <SettingsCard title="Загрузка видео" className="w-full md:w-1/2">
        <div className="flex flex-col gap-4">
          <VideoUpload />
        </div>
      </SettingsCard>
    </div>
  );
}
