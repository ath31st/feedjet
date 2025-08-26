import { useDiskUsage } from '@/entities/video/api/useVideo';
import { formatBytes } from '@/shared/lib/formatBytes';
import { ProgressBar } from './ProgressBar';

export function DiskUsageInfo() {
  const { data, isLoading } = useDiskUsage();

  if (isLoading) {
    return <span className="text-[var(--meta-text)] text-sm">Загрузка…</span>;
  }
  if (!data) {
    return <span className="text-[var(--meta-text)] text-sm">Нет данных</span>;
  }

  const usedPercent = (data.used / data.total) * 100;

  return (
    <div className="flex w-full flex-col">
      <div className="flex flex-col gap-2 text-md">
        <div className="flex justify-between">
          <span className="text-[var(--meta-text)]">Использовано:</span>
          <span>
            {formatBytes(data.used)} / {formatBytes(data.total)}
          </span>
        </div>
        <ProgressBar value={usedPercent} />
      </div>
    </div>
  );
}
