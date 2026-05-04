import { useRef, useState, useEffect } from 'react';
import Marquee from 'react-fast-marquee';

interface TextMarqueeProps {
  text: string;
  speed?: number;
  pauseOnHover?: boolean;
  direction?: 'left' | 'right';
}

// biome-ignore lint/suspicious/noExplicitAny: take component from library
const MarqueeComponent = (Marquee as any).default ?? Marquee;

export function TextMarquee({
  text,
  speed = 50,
  pauseOnHover = true,
  direction = 'left',
  ...rest
}: TextMarqueeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [shouldScroll, setShouldScroll] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const check = () => {
      setShouldScroll(el.scrollWidth > el.clientWidth);
    };

    check();

    const observer = new ResizeObserver(check);
    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full overflow-hidden whitespace-nowrap"
      {...rest}
    >
      {shouldScroll ? (
        <MarqueeComponent
          gradient={false}
          speed={speed}
          pauseOnHover={pauseOnHover}
          play={true}
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
