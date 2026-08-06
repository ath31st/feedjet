import { useState } from 'react';
import { Skeleton } from '@/shared/ui';
import { LazyImage } from '@/shared/ui/LazyImage';
import { useFeedImage } from '../api/useFeedImage';

interface FeedImageProps {
  url: string;
  width?: number;
  alt?: string;
}

export function FeedImage({ url, width, alt }: FeedImageProps) {
  const { src, isLoading } = useFeedImage(url, width);
  const [loaded, setLoaded] = useState(false);

  const imageSkeleton = <Skeleton className="absolute inset-0" />;

  if (isLoading) {
    return (
      <div className="relative flex h-full w-full items-center justify-center bg-muted">
        <Skeleton className="absolute inset-0" />
      </div>
    );
  }

  return (
    <LazyImage
      src={src}
      alt={alt}
      onLoad={() => setLoaded(true)}
      placeholder={!loaded ? imageSkeleton : undefined}
    />
  );
}
