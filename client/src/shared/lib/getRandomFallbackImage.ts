export function getRandomFallbackImage(stringForHash?: string): string {
  const maxImages = 35;
  if (!stringForHash) {
    const randomIndex = Math.floor(Math.random() * maxImages) + 1;
    return `/fallback-images/${randomIndex}.webp`;
  }

  const hash = stringForHash
    .split('')
    .reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const index = (hash % maxImages) + 1;
  return `/fallback-images/${index}.webp`;
}
