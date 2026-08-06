import type { CSSProperties } from 'react';

/** Equal-width hard-stop gradient for 1–N theme preview colors. */
export function getThemeSwatchStyle(colors: readonly string[]): CSSProperties {
  if (colors.length === 0) return {};
  if (colors.length === 1) return { backgroundColor: colors[0] };

  const stops = colors
    .map((c, i) => {
      const start = (i / colors.length) * 100;
      const end = ((i + 1) / colors.length) * 100;
      return `${c} ${start}%, ${c} ${end}%`;
    })
    .join(', ');

  return { backgroundImage: `linear-gradient(135deg, ${stops})` };
}
