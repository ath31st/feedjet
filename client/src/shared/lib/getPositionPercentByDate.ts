export function getPositionPercentByDate(
  date: Date,
  startHour: number,
  hoursLimit: number,
): number {
  const nowHours = date.getHours();
  const nowMinutes = date.getMinutes();
  const positionPercent =
    (((nowHours - startHour) * 60 + nowMinutes) / ((hoursLimit - 1) * 60)) *
    100;
  return positionPercent;
}
