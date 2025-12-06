import { SettingsCard } from '@/shared/ui/SettingsCard';
import { ImageList } from '@/features/image-list';
import { DiskUsageInfo } from '@/features/disk-usage-info';
import { ImageUpload } from '@/features/image-upload';

interface ImageContentManagementWidgetProps {
  kioskId: number;
}

export function ImageContentManagementWidget({
  kioskId,
}: ImageContentManagementWidgetProps) {
  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex w-full flex-row gap-6">
        <SettingsCard title="Использование диска" className="w-full md:w-1/2">
          <DiskUsageInfo />
        </SettingsCard>
        <SettingsCard title="Загрузка изображений" className="w-full md:w-1/2">
          <ImageUpload />
        </SettingsCard>
      </div>
      <div className="flex w-full flex-row gap-6">
        <SettingsCard title="Загруженные изображения" className="w-full">
          <ImageList kioskId={kioskId} />
        </SettingsCard>
      </div>
    </div>
  );
}
