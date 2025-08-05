export function getOnlyDateStr(date: Date): string {
  return date.toISOString().split('T')[0];
}
