import { useRef, useCallback } from 'react';

export function useHorizontalWheelScroll() {
  const cleanupRef = useRef<(() => void) | null>(null);

  const ref = useCallback((node: HTMLDivElement | null) => {
    cleanupRef.current?.();
    cleanupRef.current = null;

    if (!node) return;

    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;

      const hasOverflow = node.scrollWidth > node.clientWidth;
      const isHovered = node.matches(':hover');

      if (hasOverflow && isHovered) {
        e.preventDefault();
        node.scrollLeft += e.deltaY;
      }
    };

    node.addEventListener('wheel', onWheel, { passive: false });

    cleanupRef.current = () => {
      node.removeEventListener('wheel', onWheel);
    };
  }, []);

  return ref;
}
