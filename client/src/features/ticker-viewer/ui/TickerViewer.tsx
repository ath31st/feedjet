import { hexToRgba, isRotate90 } from '@/shared/lib';
import { TextMarquee } from '@/shared/ui';
import type { TickerConfig } from '@shared/types/ticker.config';

interface TickerViewerProps {
  config: TickerConfig;
  rotate?: number;
  showDebugBorder?: boolean;
}

export function TickerViewer({
  config,
  showDebugBorder,
  rotate,
}: TickerViewerProps) {
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

  const effectiveSpeed = isRotate90(rotate ?? 0)
    ? speedPxPerSec / 200
    : speedPxPerSec;

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
          {config.isLooped ? (
            <TextMarquee
              key={`${text}-${speedPxPerSec}-${direction}`}
              text={text || 'Пример текста бегущей строки'}
              speed={effectiveSpeed}
              pauseOnHover={false}
              direction={direction}
            />
          ) : (
            <div className="w-full overflow-hidden whitespace-nowrap">
              <span>{text || 'Пример текста бегущей строки'}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
