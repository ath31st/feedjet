import {
  isLiteAnimation,
  type AnimationType,
} from '@/shared/lib/parseAnimationParam';

/** Kiosk scenario slide / PDF page transition (tuned for weak TVs). */
export const kioskSlideMotion = {
  initial: { opacity: 0, scale: 1.04, y: 12 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.97, y: -10 },
  transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
  style: { willChange: 'opacity, transform' },
};

export function getFeedCardMotion(animation: AnimationType, index: number) {
  if (isLiteAnimation(animation)) {
    return {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { duration: 1.1, delay: index * 0.1 },
    };
  }

  return {
    initial: { opacity: 0, y: -150 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, delay: index * 0.1 },
    layout: true as const,
  };
}

export const adminTabMotion = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.25 },
};

export const popoverMotion = {
  initial: { opacity: 0, y: -6, scale: 0.96 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -6, scale: 0.96 },
  transition: { duration: 0.15, ease: 'easeOut' as const },
};

export const schedulePanelMotion = {
  initial: { opacity: 0, height: 0 },
  animate: { opacity: 1, height: 'auto' },
  exit: { opacity: 0, height: 0 },
  transition: { duration: 0.2, ease: 'easeOut' as const },
};
