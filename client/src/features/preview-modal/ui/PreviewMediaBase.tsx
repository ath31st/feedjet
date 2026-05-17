/** biome-ignore-all lint/a11y: disable all a11y rules */

interface PreviewMediaProps {
  kind: 'image' | 'video';
  src: string;
  alt?: string;
  videoMuted?: boolean;

  className?: string;
}

export function PreviewMediaBase({
  kind,
  src,
  alt,
  videoMuted,
  className,
}: PreviewMediaProps) {
  const mediaClassName = [
    'max-h-[calc(100vh-160px)] max-w-[calc(100vw-96px)] rounded-lg shadow-2xl',
    kind === 'image' ? 'object-contain' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  if (kind === 'image') {
    return <img src={src} alt={alt} className={mediaClassName} />;
  }

  return (
    <video
      src={src}
      controls
      autoPlay
      muted={videoMuted}
      className={mediaClassName}
    />
  );
}
