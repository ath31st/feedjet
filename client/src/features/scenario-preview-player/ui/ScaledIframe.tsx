import { useEffect, useRef, useState } from 'react';

interface ScaledIframeProps {
  src: string;
  iframeKey: number;
  iframeRef: React.RefObject<HTMLIFrameElement | null>;
  className?: string;
}

export function ScaledIframe({
  src,
  iframeKey,
  iframeRef,
  className,
}: ScaledIframeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => {
      const w = el.clientWidth;
      if (w > 0) setScale(w / 1920);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative aspect-video w-full overflow-hidden ${className ?? ''}`}
    >
      <iframe
        ref={iframeRef}
        key={iframeKey}
        src={src}
        title="Превью киоска"
        style={{
          width: 1920,
          height: 1080,
          border: 0,
          position: 'absolute',
          top: 0,
          left: 0,
          transformOrigin: '0 0',
          transform: `scale(${scale})`,
        }}
      />
    </div>
  );
}
