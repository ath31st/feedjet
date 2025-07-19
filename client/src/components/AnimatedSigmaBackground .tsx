const baseColor = [138, 148, 168];

function getSVG(alpha: number) {
  const fill = `rgba(${baseColor.join(',')},${alpha})`;
  return `url("data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox='0 0 100 100'>
      <text x='20' y='100' font-size='80' fill='${fill}'>Σ</text>
    </svg>`,
  )}")`;
}

export function AnimatedSigmaBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: getSVG(0.08),
          backgroundRepeat: 'repeat',
          backgroundSize: 'clamp(50px, 20vw, 800px)',
          animation: 'scroll-diagonal-switch 20s linear infinite',
          filter: 'blur(2px)',
        }}
      />
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: getSVG(0.06),
          backgroundRepeat: 'repeat',
          backgroundSize: 'clamp(100px, 25vw, 900px)',
          animation: 'scroll-diagonal-switch 25s linear infinite',
          filter: 'blur(3px)',
          transform: 'scale(1.1)',
        }}
      />
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: getSVG(0.05),
          backgroundRepeat: 'repeat',
          backgroundSize: 'clamp(100px, 30vw, 2000px)',
          animation: 'scroll-diagonal-switch 30s linear infinite',
          filter: 'blur(6px)',
          transform: 'scale(1.3)',
        }}
      />
    </div>
  );
}
