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
}: TextMarqueeProps) {
  return (
    <div className="w-full overflow-hidden whitespace-nowrap">
      <MarqueeComponent
        gradient={false}
        speed={speed}
        pauseOnHover={pauseOnHover}
        play={true}
        direction={direction}
      >
        <span className="mr-6">{text}</span>
      </MarqueeComponent>
    </div>
  );
}
