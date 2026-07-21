import { useLayoutEffect, useRef, useState } from 'react';
import Marquee from 'react-fast-marquee';

interface TextMarqueeProps {
  text: string;
  speed?: number;
  pauseOnHover?: boolean;
  direction?: 'left' | 'right';
  overflowOnly?: boolean;
}

// biome-ignore lint/suspicious/noExplicitAny: take component from library
const MarqueeComponent = (Marquee as any).default ?? Marquee;

export function TextMarquee({
  text,
  speed = 50,
  pauseOnHover = true,
  direction = 'left',
  overflowOnly = false,
}: TextMarqueeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLSpanElement>(null);
  const [overflows, setOverflows] = useState(false);

  useLayoutEffect(() => {
    if (!overflowOnly) return;

    const container = containerRef.current;
    const measure = measureRef.current;
    if (!container || !measure) return;

    const update = () => {
      setOverflows(measure.scrollWidth > container.clientWidth + 1);
    };

    update();

    // Layout can settle after fullscreen / first paint
    const rafId = requestAnimationFrame(() => {
      update();
      requestAnimationFrame(update);
    });

    const observer = new ResizeObserver(update);
    observer.observe(container);

    void document.fonts?.ready.then(update);

    return () => {
      cancelAnimationFrame(rafId);
      observer.disconnect();
    };
  }, [overflowOnly]);

  const shouldPlay = !overflowOnly || overflows;

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden whitespace-nowrap"
    >
      {overflowOnly && (
        <span
          ref={measureRef}
          className="pointer-events-none invisible absolute top-0 left-0 whitespace-nowrap"
          aria-hidden
        >
          {text}
        </span>
      )}

      {shouldPlay ? (
        <MarqueeComponent
          gradient={false}
          speed={speed}
          pauseOnHover={pauseOnHover}
          play
          direction={direction}
        >
          <span className="mr-6">{text}</span>
        </MarqueeComponent>
      ) : (
        <span>{text}</span>
      )}
    </div>
  );
}
