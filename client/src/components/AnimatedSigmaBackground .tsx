const color = getComputedStyle(document.documentElement)
  .getPropertyValue('--meta-text')
  .trim();

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <text x="0" y="100" font-size="80" fill="${color}">Σ</text>
</svg>
`;

export function AnimatedSigmaBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          color: 'var(--meta-text)',
          backgroundImage: `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`,
          backgroundRepeat: 'repeat',
          backgroundSize: 'clamp(50px, 20vw, 500px)',
          animation: 'scroll-diagonal-switch 20s linear infinite',
          opacity: 0.15,
          filter: 'blur(1px)',
          zIndex: -1,
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          color: 'var(--meta-text)',
          backgroundImage: `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`,
          backgroundRepeat: 'repeat',
          backgroundSize: 'clamp(100px, 25vw, 500px)',
          animation: 'scroll-diagonal-switch 25s linear infinite',
          opacity: 0.07,
          filter: 'blur(3px)',
          zIndex: -2,
          transform: 'scale(1.1)',
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          color: 'var(--meta-text)',
          backgroundImage: `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`,
          backgroundRepeat: 'repeat',
          backgroundSize: 'clamp(100px, 30vw, 500px)',
          animation: 'scroll-diagonal-switch 30s linear infinite',
          opacity: 0.07,
          filter: 'blur(7px)',
          zIndex: -3,
          transform: 'scale(1.4)',
        }}
      />
    </div>
  );
}
