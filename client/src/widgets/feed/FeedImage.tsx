import { useState } from 'react';
import { LoadingThreeDotsJumping } from '@/shared/ui/LoadingThreeDotsJumping';
import { LazyImage } from '@/shared/ui/LazyImage';
import { useFeedImage } from './api/useFeedImage';

interface FeedImageProps {
  url: string;
  width?: number;
  alt?: string;
}

export function FeedImage({ url, width, alt }: FeedImageProps) {
  const { src, isLoading } = useFeedImage(url, width);
  const [loaded, setLoaded] = useState(false);

  if (isLoading) {
    return (
      <div className="relative flex h-full w-full items-center justify-center bg-muted">
        <LoadingThreeDotsJumping />
      </div>
    );
  }

  return (
    <LazyImage
      src={src}
      alt={alt}
      onLoad={() => setLoaded(true)}
      placeholder={!loaded && <LoadingThreeDotsJumping />}
    />
  );
}
