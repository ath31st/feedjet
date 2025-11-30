import { useDiskUsage } from '@/entities/video';
import { DiskUsageView } from '@/shared/ui';

export function DiskUsageInfo() {
  const { data, isLoading } = useDiskUsage();

  return (
    <DiskUsageView
      used={data?.used ?? 0}
      total={data?.total ?? 1}
      isLoading={isLoading}
    />
  );
}
