import type { ReactNode } from 'react';

interface LazyImageProps {
  src: string;
  alt?: string;
  onLoad?: () => void;
  placeholder?: ReactNode;
  className?: string;
}

export function LazyImage({
  src,
  alt,
  onLoad,
  placeholder,
  className,
}: LazyImageProps) {
  return (
    <div className={`relative h-full w-full bg-muted ${className ?? ''}`}>
      {placeholder}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={onLoad}
        className="h-full w-full object-cover transition-opacity duration-300"
      />
    </div>
  );
}
