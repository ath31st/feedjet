import { useMemo } from 'react';
import { random, resolveSeason } from './useSeasonOverlay';
import type { SeasonOverlayMode } from '@/entities/ui-config';

const animationStyles = `
  /* WINTER and SPRING: FALL */
  @keyframes fall {
    0% { top: -10%; }
    100% { top: 110%; }
  }

  @keyframes rise {
    0% { top: 110%; }
    100% { top: -10%; }
  }

  @keyframes sway {
    0%, 100% { transform: translateX(0); }
    50% { transform: translateX(25px); }
  }

  /* AUTUMN */
  @keyframes fallRotate {
    0% { top: -10%; transform: rotate(0deg); }
    100% { top: 110%; transform: rotate(360deg); }
  }

  /* SUMMER - FIREFLIES */
  @keyframes firefly {
    0%, 100% {
      opacity: 0;
      transform: translate(0, 0) scale(0.6);
    }
    25% {
      opacity: 0.5;
    }
    50% {
      opacity: 1;
      transform: translate(10px, -15px) scale(1);
    }
    75% {
      opacity: 0.3;
    }
  }

  @keyframes drift {
    0% { transform: translate(0, 0); }
    25% { transform: translate(8px, -12px); }
    50% { transform: translate(-5px, -20px); }
    75% { transform: translate(12px, -8px); }
    100% { transform: translate(0, 0); }
  }
`;

interface SeasonOverlayProps {
  mode: SeasonOverlayMode;
}

export const SeasonOverlay = ({ mode }: SeasonOverlayProps) => {
  const colors = ['#ffa500', '#d2691e', '#ffd700', '#a52a2a'];
  const season = resolveSeason(mode);

  const particlesData = useMemo(() => {
    const MAX_PARTICLES = 50;

    return Array.from({ length: MAX_PARTICLES }).map((_, id) => ({
      id,

      leftPosition: `${random(0, 100)}%`,

      // winter
      durationFall: random(10, 20),
      durationSway: random(3, 6),
      delay: random(0, 10),
      size: random(8, 14),

      // spring
      durationRise: random(10, 18),
      delaySpring: random(0, 8),
      sizeSpring: random(10, 15),

      // autumn
      colorIndex: Math.floor(random(0, colors.length)),
      durationFallRotate: random(10, 18),
      delayAutumn: random(0, 10),

      // summer (fireflies)
      topPosition: `${random(5, 95)}%`,
      fireflySize: random(6, 14),
      fireflyDuration: random(2, 5),
      driftDuration: random(10, 20),
      fireflyDelay: random(0, 6),
    }));
  }, [colors.length]);

  const renderWinter = () => {
    const winterParticles = particlesData.slice(0, 30);

    return (
      <>
        {winterParticles.map((p) => (
          <div
            key={p.id}
            className="absolute -top-4"
            style={{
              left: p.leftPosition,
              animation: `fall ${p.durationFall}s linear infinite`,
              animationDelay: `${p.delay}s`,
            }}
          >
            <div
              className="rounded-full bg-white opacity-70"
              style={{
                width: `${p.size}px`,
                height: `${p.size}px`,
                animation: `sway ${p.durationSway}s ease-in-out infinite`,
              }}
            />
          </div>
        ))}
      </>
    );
  };

  const renderSpring = () => {
    const springParticles = particlesData.slice(0, 25);

    return (
      <>
        {springParticles.map((p) => (
          <div
            key={p.id}
            className="absolute -top-4"
            style={{
              left: p.leftPosition,
              animation: `rise ${p.durationRise}s linear infinite`,
              animationDelay: `${p.delaySpring}s`,
            }}
          >
            <div
              className="opacity-60"
              style={{
                backgroundColor: '#ffb7c5',
                borderRadius: '50% 0 50% 0',
                width: `${p.sizeSpring}px`,
                height: `${p.sizeSpring}px`,
                animation: `sway ${p.durationSway}s ease-in-out infinite`,
              }}
            />
          </div>
        ))}
      </>
    );
  };

  const renderAutumn = () => {
    const autumnParticles = particlesData.slice(0, 20);

    return (
      <>
        {autumnParticles.map((p) => (
          <div
            key={p.id}
            className="absolute -top-8 opacity-50"
            style={{
              left: p.leftPosition,
              width: `${p.size}px`,
              height: `${p.size}px`,
              backgroundColor: colors[p.colorIndex],
              animation: `fallRotate ${p.durationFallRotate}s linear infinite`,
              animationDelay: `${p.delayAutumn}s`,
            }}
          />
        ))}
      </>
    );
  };

  const renderSummer = () => {
    const fireflies = particlesData.slice(0, 40);

    return (
      <>
        {fireflies.map((p) => (
          <div
            key={p.id}
            className="absolute"
            style={{
              left: p.leftPosition,
              top: p.topPosition,

              opacity: 0,
              transform: 'translate(0, 0) scale(0.6)',

              animation: `
              drift ${p.driftDuration}s ease-in-out infinite,
              firefly ${p.fireflyDuration}s ease-in-out infinite
            `,
              animationDelay: `
              ${p.fireflyDelay}s,
              ${p.fireflyDelay}s
            `,
            }}
          >
            <div
              style={{
                width: `${p.fireflySize}px`,
                height: `${p.fireflySize}px`,
                borderRadius: '50%',
                backgroundColor: '#fff59d',
                boxShadow: `
                0 0 6px rgba(255,255,180,0.9),
                0 0 12px rgba(255,235,59,0.7),
                0 0 18px rgba(255,235,59,0.4)
              `,
              }}
            />
          </div>
        ))}
      </>
    );
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: no need to re-render
  const content = useMemo(() => {
    switch (season) {
      case 'winter':
        return renderWinter();
      case 'spring':
        return renderSpring();
      case 'autumn':
        return renderAutumn();
      case 'summer':
        return renderSummer();
      default:
        return null;
    }
  }, [season]);

  if (!season) return null;

  return (
    <div className="pointer-events-none absolute top-0 left-0 z-1 h-full w-full overflow-hidden">
      <style>{animationStyles}</style>
      {content}
    </div>
  );
};
