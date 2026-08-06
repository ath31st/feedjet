import { Skeleton } from './Skeleton';

interface RowListSkeletonProps {
  count?: number;
  className?: string;
}

export function RowListSkeleton({
  count = 4,
  className,
}: RowListSkeletonProps) {
  return (
    <ul className={`space-y-2 ${className ?? ''}`}>
      {Array.from({ length: count }).map((_, i) => (
        <li
          // biome-ignore lint/suspicious/noArrayIndexKey: skeleton
          key={i}
          className="rounded-lg border border-(--border) px-4 py-3"
        >
          <Skeleton className="h-10 w-full" />
        </li>
      ))}
    </ul>
  );
}
