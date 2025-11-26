export const formatSecondsToTime = (totalSeconds: number): string => {
  if (totalSeconds < 0) return '0 секунд';

  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  const parts = [];

  if (minutes > 0) {
    const minuteText =
      minutes === 1
        ? 'минута'
        : minutes >= 2 && minutes <= 4
          ? 'минуты'
          : 'минут';
    parts.push(`${minutes} ${minuteText}`);
  }

  if (seconds > 0 || minutes === 0) {
    const secondText =
      seconds === 1
        ? 'секунда'
        : seconds >= 2 && seconds <= 4
          ? 'секунды'
          : 'секунд';
    parts.push(`${seconds} ${secondText}`);
  }

  return parts.join(', ') || '0 секунд';
};
