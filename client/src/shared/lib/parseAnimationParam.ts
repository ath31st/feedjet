import type { AnimationType } from '@/entities/ui-config';

export type { AnimationType };

export function isLiteAnimation(value: AnimationType): boolean {
  return value === 'lite';
}
