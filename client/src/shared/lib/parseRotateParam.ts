export function parseRotateParam(
  value: string | null,
): -180 | -90 | 0 | 90 | 180 {
  const parsed = Number(value);
  const allowed = new Set([-180, -90, 0, 90, 180]);
  return allowed.has(parsed) ? (parsed as -180 | -90 | 0 | 90 | 180) : 0;
}

export function isRotate90(value: number): boolean {
  return value === -90 || value === 90;
}
