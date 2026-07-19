import { useEffect, useEffectEvent, useRef, useState } from 'react';

interface ScaledIframeProps {
  src: string;
  iframeKey: number;
  iframeRef: React.RefObject<HTMLIFrameElement | null>;
  className?: string;
}

const PREVIEW_NAVIGATE = 'kiosk-preview:navigate';

export function ScaledIframe({
  src,
  iframeKey,
  iframeRef,
  className,
}: ScaledIframeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  /** Hard boot URL — only changes on first mount / manual reload (iframeKey). */
  const [bootSrc, setBootSrc] = useState(src);
  const loadedRef = useRef(false);
  const pendingSrcRef = useRef<string | null>(null);
  const displayedSrcRef = useRef(src);
  const prevKeyRef = useRef(iframeKey);

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

  const postSoftNavigate = useEffectEvent((path: string) => {
    iframeRef.current?.contentWindow?.postMessage(
      { type: PREVIEW_NAVIGATE, path },
      window.location.origin,
    );
  });

  useEffect(() => {
    if (iframeKey !== prevKeyRef.current) {
      prevKeyRef.current = iframeKey;
      loadedRef.current = false;
      pendingSrcRef.current = null;
      displayedSrcRef.current = src;
      setBootSrc(src);
      return;
    }

    if (src === displayedSrcRef.current) return;

    if (!loadedRef.current) {
      pendingSrcRef.current = src;
      return;
    }

    displayedSrcRef.current = src;
    postSoftNavigate(src);
  }, [src, iframeKey]);

  const handleLoad = () => {
    loadedRef.current = true;
    const pending = pendingSrcRef.current;
    pendingSrcRef.current = null;

    if (pending && pending !== displayedSrcRef.current) {
      displayedSrcRef.current = pending;
      postSoftNavigate(pending);
    } else {
      displayedSrcRef.current = bootSrc;
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative aspect-video w-full overflow-hidden ${className ?? ''}`}
    >
      <iframe
        ref={iframeRef}
        key={iframeKey}
        src={bootSrc}
        title="Превью киоска"
        onLoad={handleLoad}
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
