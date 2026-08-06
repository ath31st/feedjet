import { Skeleton } from './Skeleton';

interface ScenarioItemsSkeletonProps {
  count?: number;
  className?: string;
}

export function ScenarioItemsSkeleton({
  count = 5,
  className,
}: ScenarioItemsSkeletonProps) {
  return (
    <div className={`flex flex-col gap-2 ${className ?? ''}`}>
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton
          // biome-ignore lint/suspicious/noArrayIndexKey: skeleton
          key={i}
          className="h-16 rounded-lg"
        />
      ))}
    </div>
  );
}
