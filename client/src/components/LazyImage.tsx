import { useState } from 'react';
import { LoadingThreeDotsJumping } from './LoadingThreeDotsJumping';

interface LazyImageProps {
  src: string;
  alt?: string;
}

export function LazyImage({ src, alt }: LazyImageProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative h-full w-full bg-muted">
      {!loaded && <LoadingThreeDotsJumping />}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        className={`h-full w-full object-cover transition-opacity duration-300 ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
}
