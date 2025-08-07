export const animationTypes = ['full', 'lite'] as const;

export type AnimationType = (typeof animationTypes)[number];

export function parseAnimationParam(value: string | null): AnimationType {
  return animationTypes.includes(value as AnimationType)
    ? (value as AnimationType)
    : 'full';
}

export function isLiteAnimation(value: AnimationType): boolean {
  return value === 'lite';
}
