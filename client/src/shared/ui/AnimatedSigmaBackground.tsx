import sigmaUrl from '../assets/sigma_crimsonpro.webp';

export function AnimatedSigmaBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 z-1 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url("${sigmaUrl}")`,
          backgroundRepeat: 'repeat',
          backgroundSize: 'clamp(50px, 20vw, 800px)',
          animation:
            'scroll-diagonal-switch 20s linear infinite, fade-in-out 20s linear infinite',
          filter: 'blur(1px)',
          willChange: 'transform, background-position, opacity',
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url("${sigmaUrl}")`,
          backgroundRepeat: 'repeat',
          backgroundSize: 'clamp(100px, 25vw, 900px)',
          animation:
            'scroll-diagonal-switch 25s linear infinite, fade-in-out 25s linear infinite',
          filter: 'blur(3px)',
          transform: 'scale(1.1)',
          willChange: 'transform, background-position, opacity',
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url("${sigmaUrl}")`,
          backgroundRepeat: 'repeat',
          backgroundSize: 'clamp(100px, 30vw, 2000px)',
          animation:
            'scroll-diagonal-switch 30s linear infinite, fade-in-out 30s linear infinite',
          filter: 'blur(6px)',
          transform: 'scale(1.3)',
          willChange: 'transform, background-position, opacity',
        }}
      />
    </div>
  );
}
