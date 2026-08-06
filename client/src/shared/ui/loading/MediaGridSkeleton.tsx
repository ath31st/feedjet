import { Skeleton } from './Skeleton';

interface MediaGridSkeletonProps {
  count?: number;
  className?: string;
}

export function MediaGridSkeleton({
  count = 12,
  className,
}: MediaGridSkeletonProps) {
  return (
    <div className={`flex-1 overflow-y-auto p-2 ${className ?? ''}`}>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-3">
        {Array.from({ length: count }).map((_, i) => (
          <Skeleton
            // biome-ignore lint/suspicious/noArrayIndexKey: skeleton
            key={i}
            className="h-42 rounded-lg"
          />
        ))}
      </div>
    </div>
  );
}
