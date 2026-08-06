import { EntityCardSkeleton } from './EntityCardSkeleton';

interface ListSkeletonProps {
  count?: number;
  className?: string;
}

export function ListSkeleton({ count = 4, className }: ListSkeletonProps) {
  return (
    <div className={`grid grid-cols-1 gap-4 xl:grid-cols-2 ${className ?? ''}`}>
      {Array.from({ length: count }).map((_, i) => (
        <EntityCardSkeleton
          // biome-ignore lint/suspicious/noArrayIndexKey: skeleton
          key={i}
        />
      ))}
    </div>
  );
}
