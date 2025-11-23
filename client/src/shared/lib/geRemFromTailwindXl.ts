const TAILWIND_TO_REM: Record<number, number> = {
  1: 1.25,
  2: 1.5,
  3: 1.875,
  4: 2.25,
  5: 3,
  6: 3.75,
  7: 4.5,
  8: 6,
  9: 8,
};

export function geRemFromTailwindXl(xl: number): number {
  return TAILWIND_TO_REM[xl] || 1;
}
