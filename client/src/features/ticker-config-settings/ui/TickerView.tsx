import { hexToRgba } from '@/shared/lib';
import { TextMarquee } from '@/shared/ui';
import type { TickerConfig } from '@shared/types/ticker.config';

interface TickerViewProps {
  config: TickerConfig;
  showDebugBorder?: boolean;
}

export function TickerView({ config, showDebugBorder }: TickerViewProps) {
  const {
    text,
    speedPxPerSec,
    direction,
    fontScale,
    textColor,
    backgroundColor,
    backgroundOpacity,
    height,
    positionY,
    paddingX,
  } = config;

  return (
    <div className="absolute inset-0" style={{ containerType: 'size' }}>
      <div
        className={`absolute left-0 w-full ${
          showDebugBorder ? 'border border-red-500' : ''
        }`}
        style={{
          top: `${positionY}%`,
          transform: 'translateY(0%)',
          height: `${height}%`,
          backgroundColor: hexToRgba(backgroundColor, backgroundOpacity),
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div
          className="w-full"
          style={{
            paddingLeft: `${paddingX}%`,
            paddingRight: `${paddingX}%`,
            color: textColor,
            fontSize: `calc(${fontScale} * 0.01 * 1cqw)`,
          }}
        >
          <TextMarquee
            text={text || 'Пример текста бегущей строки'}
            speed={speedPxPerSec}
            pauseOnHover={false}
            direction={direction}
          />
        </div>
      </div>
    </div>
  );
}
