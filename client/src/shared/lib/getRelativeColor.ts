export const getRelativeColor = (d: number | string | Date) => {
  const diff = Date.now() - new Date(d).getTime();
  const sec = Math.floor(diff / 1000);

  if (sec < 120) return 'text-green-500';

  const min = Math.floor(sec / 60);

  if (min < 60) return 'text-orange-500';

  return 'text-red-500';
};
