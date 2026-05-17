import type { ReactNode } from 'react';

type Direction = 'down' | 'up';

interface SlideProps {
  show: boolean;
  children: ReactNode;
  direction?: Direction;
  heightClass?: string;
  className?: string;
}

export function SlideSlot({
  show,
  children,
  direction = 'down',
  heightClass = 'h-10',
  className = '',
}: SlideProps) {
  const hiddenClass = direction === 'down' ? '-translate-y-6' : 'translate-y-6';

  return (
    <div className={`flex justify-center overflow-hidden ${className}`}>
      <div className={`flex items-center ${heightClass}`}>
        <div
          className={`transition-all duration-500 ease-in-out ${
            show
              ? 'translate-y-0 opacity-100'
              : `${hiddenClass} pointer-events-none opacity-0`
          }`}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
