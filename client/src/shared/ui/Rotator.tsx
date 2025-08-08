import type { ReactNode } from 'react';

interface RotatorProps {
  rotate?: -180 | -90 | 0 | 90 | 180;
  children: ReactNode;
}

export function Rotator({ rotate = 0, children }: RotatorProps) {
  let transform = 'none';
  let width = '100vw';
  let height = '100vh';

  switch (rotate) {
    case -90:
      transform = 'rotate(-90deg) translateX(-100vh)';
      width = '100vh';
      height = '100vw';
      break;
    case -180:
    case 180:
      transform = 'rotate(180deg) translate(-100vw, -100vh)';
      break;
    case 90:
      transform = 'rotate(90deg) translate(0, -100vw)';
      width = '100vh';
      height = '100vw';
      break;
    default:
      transform = 'none';
      break;
  }

  return (
    <div
      className="absolute top-0 left-0 overflow-hidden p-4"
      style={{
        transform,
        transformOrigin: 'top left',
        width,
        height,
      }}
    >
      {children}
    </div>
  );
}
