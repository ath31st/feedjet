import { Skeleton } from './Skeleton';

interface TextLinesSkeletonProps {
  count?: number;
  lineClassName?: string;
  className?: string;
}

export function TextLinesSkeleton({
  count = 8,
  lineClassName = 'h-6',
  className,
}: TextLinesSkeletonProps) {
  return (
    <div className={`space-y-2 ${className ?? ''}`}>
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton
          // biome-ignore lint/suspicious/noArrayIndexKey: skeleton
          key={i}
          className={`rounded ${lineClassName}`}
        />
      ))}
    </div>
  );
}
