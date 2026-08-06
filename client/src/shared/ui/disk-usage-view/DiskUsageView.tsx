import { formatBytes } from '@/shared/lib/formatBytes';
import { Spinner } from '@/shared/ui';
import { ProgressBar } from './ProgressBar';

interface DiskUsageViewProps {
  used: number;
  total: number;
  isLoading?: boolean;
}

export function DiskUsageView({ used, total, isLoading }: DiskUsageViewProps) {
  if (isLoading) {
    return <Spinner size="sm" />;
  }

  const usedPercent = (used / total) * 100;

  return (
    <div className="flex w-full flex-col">
      <div className="flex flex-col gap-2 text-xs">
        <div className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5">
          <span className="text-(--meta-text)">Использовано:</span>
          <span className="whitespace-nowrap">
            {formatBytes(used)} / {formatBytes(total)}
          </span>
        </div>
        <ProgressBar value={usedPercent} />
      </div>
    </div>
  );
}
