import textureUrl from '../assets/texture.png';

export function StaticBackground() {
  return (
    <div className="-z-1 pointer-events-none fixed inset-0 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url("${textureUrl}")`,
          // backgroundRepeat: 'repeat', // for seamless
          backgroundSize: 'cover', // or auto
          backgroundPosition: 'center',
          opacity: 0.2, // adjust opacity
        }}
      />

      <div
        className="absolute inset-0"
        style={{
          background: `hsl(var(--hue) 90% 10% / 0.5)`,
          mixBlendMode: 'overlay',
        }}
      />
    </div>
  );
}
