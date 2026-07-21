function pluralize(
  value: number,
  one: string,
  few: string,
  many: string,
): string {
  const mod10 = value % 10;
  const mod100 = value % 100;

  if (mod100 >= 11 && mod100 <= 14) {
    return many;
  }

  if (mod10 === 1) {
    return one;
  }

  if (mod10 >= 2 && mod10 <= 4) {
    return few;
  }

  return many;
}

export function formatCountdownRu(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  const parts: string[] = [];

  if (hours > 0) {
    parts.push(
      `${hours} ${pluralize(hours, 'час', 'часа', 'часов')}`,
    );
  }

  if (minutes > 0 || hours === 0) {
    parts.push(
      `${minutes} ${pluralize(minutes, 'минута', 'минуты', 'минут')}`,
    );
  }

  return parts.join(' ');
}
