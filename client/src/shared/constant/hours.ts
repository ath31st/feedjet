export const hours = Array.from(
  { length: 12 },
  (_, i) => `${String(8 + i).padStart(2, '0')}:00`,
);
