import { formatBytes } from '@/shared/lib/formatBytes';
import { ProgressBar } from './ProgressBar';

interface DiskUsageViewProps {
  used: number;
  total: number;
  isLoading?: boolean;
}

export function DiskUsageView({ used, total, isLoading }: DiskUsageViewProps) {
  if (isLoading) {
    return <span className="text-[var(--meta-text)] text-sm">Загрузка…</span>;
  }

  const usedPercent = (used / total) * 100;

  return (
    <div className="flex w-full flex-col">
      <div className="flex flex-col gap-2 text-md">
        <div className="flex justify-between">
          <span className="text-[var(--meta-text)]">Использовано:</span>
          <span>
            {formatBytes(used)} / {formatBytes(total)}
          </span>
        </div>
        <ProgressBar value={usedPercent} />
      </div>
    </div>
  );
}
