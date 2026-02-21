import { useMemo } from 'react';
import { getCurrentSeason } from './useSeasonOverlay';

const random = (min: number, max: number) => Math.random() * (max - min) + min;

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

  /* WINTER and SPRING: SWAY (horizontal) */
  @keyframes sway {
    0%, 100% { transform: translateX(0); }
    50% { transform: translateX(25px); }
  }
  
  /* AUTUMN */
  @keyframes fallRotate {
    0% { top: -10%; rotate(0deg); }
    100% { top: 110%; rotate(360deg); }
  }
  
  /* SUMMER */
  @keyframes spin-slow {
    from { transform: translate(-50%, -50%) rotate(0deg); }
    to { transform: translate(-50%, -50%) rotate(360deg); }
  }
  @keyframes sun-pulse {
    0%, 100% { opacity: 0.8; transform: scaleY(1); }
    50% { opacity: 1; transform: scaleY(1.1); }
  }
`;

export const SeasonOverlay = () => {
  const colors = ['#ffa500', '#d2691e', '#ffd700', '#a52a2a'];
  const season = getCurrentSeason();

  const particlesData = useMemo(() => {
    const MAX_PARTICLES = 30;

    return Array.from({ length: MAX_PARTICLES }).map((_, id) => ({
      id: id,

      durationFall: random(10, 20),
      durationSway: random(3, 6),
      delay: random(0, 10),
      size: random(8, 14),
      leftPosition: `${random(0, 100)}%`,

      durationRise: random(10, 18),
      delaySpring: random(0, 8),
      sizeSpring: random(10, 15),

      colorIndex: Math.floor(random(0, colors.length)),
      durationFallRotate: random(10, 18),
      delayAutumn: random(0, 10),
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

  const summerElements = Array.from({ length: 12 }).map((_, i) => i);

  const renderSummer = () => (
    <div className="absolute -top-[60px] -right-[60px] h-[240px] w-[240px]">
      <div
        className="relative h-full w-full rounded-full"
        style={{
          background:
            'radial-gradient(circle at center, #ffeb3b 0%, #ffd700 40%, #ffa726 80%)',
          boxShadow:
            '0 0 80px rgba(255, 215, 0, 0.6), 0 0 120px rgba(255, 193, 7, 0.4), inset 0 0 40px rgba(255, 255, 255, 0.3)',
        }}
      >
        <div
          className="absolute top-1/2 left-1/2 h-0 w-0"
          style={{ animation: 'spin-slow 30s linear infinite' }}
        >
          {summerElements.map((id) => (
            <div
              key={id}
              className="absolute origin-top-left"
              style={{ transform: `rotate(${id * 30}deg)` }}
            >
              <div
                className="absolute h-[300px] w-[3px]"
                style={{
                  background:
                    'linear-gradient(to bottom, rgba(255, 235, 59, 0.8) 0%, rgba(255, 215, 0, 0.4) 30%, rgba(255, 193, 7, 0.2) 60%, transparent 100%)',
                  boxShadow: '0 0 10px rgba(255, 215, 0, 0.3)',
                  animation: 'sun-pulse 3s ease-in-out infinite',
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: no need to re-render
  const content = useMemo(() => {
    switch (season) {
      case 'winter':
        return renderWinter();
      case 'autumn':
        return renderAutumn();
      case 'summer':
        return renderSummer();
      case 'spring':
        return renderSpring();
      default:
        return null;
    }
  }, [season]);

  return (
    <div className="pointer-events-none absolute top-0 left-0 z-[1] h-full w-full overflow-hidden">
      <style>{animationStyles}</style>
      {content}
    </div>
  );
};
