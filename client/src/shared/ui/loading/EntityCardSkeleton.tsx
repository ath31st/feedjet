import { Skeleton } from './Skeleton';

export function EntityCardSkeleton() {
  return (
    <div className="rounded-lg border border-(--border) bg-(--card-bg) p-3">
      <Skeleton className="h-5 w-1/3" />
      <div className="mt-3 space-y-2">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-1/3" />
      </div>
    </div>
  );
}
