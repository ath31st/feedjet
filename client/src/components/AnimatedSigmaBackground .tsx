import { useEffect, useState } from 'react';

export function AnimatedSigmaBackground() {
  const [color, setColor] = useState('rgba(255,255,255,0.1)');

  useEffect(() => {
    const metaTextColor = getComputedStyle(document.documentElement)
      .getPropertyValue('--meta-text')
      .trim();

    if (metaTextColor) setColor(metaTextColor);
  }, []);

  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <text x="20" y="100" font-size="80" fill="${color}">Σ</text>
</svg>
`;

  const dataUrl = `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0 z-0"
        style={{
          color,
          backgroundImage: dataUrl,
          backgroundRepeat: 'repeat',
          backgroundSize: 'clamp(50px, 20vw, 500px)',
          animation: 'scroll-diagonal-switch 20s linear infinite',
          opacity: 0.17,
          filter: 'blur(1px)',
        }}
      />
      <div
        className="absolute inset-0 z-0"
        style={{
          color,
          backgroundImage: dataUrl,
          backgroundRepeat: 'repeat',
          backgroundSize: 'clamp(100px, 25vw, 500px)',
          animation: 'scroll-diagonal-switch 25s linear infinite',
          opacity: 0.15,
          filter: 'blur(3px)',
          transform: 'scale(1.1)',
        }}
      />
      <div
        className="absolute inset-0 z-0"
        style={{
          color,
          backgroundImage: dataUrl,
          backgroundRepeat: 'repeat',
          backgroundSize: 'clamp(100px, 30vw, 500px)',
          animation: 'scroll-diagonal-switch 30s linear infinite',
          opacity: 0.15,
          filter: 'blur(7px)',
          transform: 'scale(1.4)',
        }}
      />
    </div>
  );
}
