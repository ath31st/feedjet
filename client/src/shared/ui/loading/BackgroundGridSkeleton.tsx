import { Skeleton } from './Skeleton';

export function BackgroundGridSkeleton() {
  return (
    <div className="grid grid-cols-6 gap-4">
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          // biome-ignore lint/suspicious/noArrayIndexKey: skeleton
          key={i}
          className="flex flex-col gap-1"
        >
          <Skeleton className="h-4 w-16" />
          <Skeleton className="aspect-video rounded-lg" />
        </div>
      ))}
    </div>
  );
}
