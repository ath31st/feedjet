import { useRef, useState, useEffect } from 'react';
import Marquee from 'react-fast-marquee';

interface TextMarqueeProps {
  text: string;
  speed?: number;
  pauseOnHover?: boolean;
}

export function TextMarquee({
  text,
  speed = 50,
  pauseOnHover = true,
  ...rest
}: TextMarqueeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [shouldScroll, setShouldScroll] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    setShouldScroll(el.scrollWidth > el.clientWidth);
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full overflow-hidden whitespace-nowrap"
      {...rest}
    >
      {shouldScroll ? (
        <Marquee
          gradient={false}
          speed={speed}
          pauseOnHover={pauseOnHover}
          play={true}
        >
          <span className="mr-6">{text}</span>
        </Marquee>
      ) : (
        <span>{text}</span>
      )}
    </div>
  );
}
