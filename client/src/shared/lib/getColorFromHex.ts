export const getColorFromHex = (hexColor: string): string => {
  if (hexColor.length !== 7 || hexColor[0] !== '#') return '#000';

  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);

  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  return luminance > 0.5 ? '#1f2937' : '#f9fafb';
};
