export const hexToRgba = (hex: string, opacity: number): string => {
  if (hex.length !== 7 || hex[0] !== '#') return `rgba(0,0,0,${opacity})`;

  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  return `rgba(${r}, ${g}, ${b}, ${opacity / 100})`;
};
