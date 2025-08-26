import { useDiskUsage } from '@/entities/video/api/useVideo';
import { formatBytes } from '@/shared/lib/formatBytes';

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
        <div className="h-20 w-full rounded-lg bg-[var(--button-bg)]">
          <div
            className="h-20 rounded-lg bg-[var(--button-hover-bg)]"
            style={{ width: `${usedPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
}
