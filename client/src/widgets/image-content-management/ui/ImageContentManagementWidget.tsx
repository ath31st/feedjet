import { SettingsCard } from '@/shared/ui/SettingsCard';
import { ImageList } from '@/features/image-list';
import { DiskUsageInfo } from '@/features/disk-usage-info';
import { ImageUpload } from '@/features/image-upload';
import { ImageRotationInterval } from '@/features/image-rotation-interval';

interface ImageContentManagementWidgetProps {
  kioskId: number;
}

export function ImageContentManagementWidget({
  kioskId,
}: ImageContentManagementWidgetProps) {
  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex w-full flex-row gap-6">
        <div className="flex w-full flex-col gap-6 md:w-1/2">
          <SettingsCard title="Использование диска" className="">
            <DiskUsageInfo />
          </SettingsCard>
          <SettingsCard title="Длительность показа изображений">
            <ImageRotationInterval kioskId={kioskId} />
          </SettingsCard>
        </div>
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
