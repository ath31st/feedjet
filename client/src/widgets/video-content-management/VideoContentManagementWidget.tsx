import { SettingsCard } from '@/shared/ui/SettingsCard';
import { VideoUpload } from '@/features/video-upload';
import { VideoList } from '@/features/video-list';

export function VideoContentManagementWidget() {
  return (
    <SettingsCard title="Управление видеоконтентом" className="w-full md:w-1/2">
      <div className="flex flex-col gap-4">
        <VideoUpload />
        <VideoList />
      </div>
    </SettingsCard>
  );
}
