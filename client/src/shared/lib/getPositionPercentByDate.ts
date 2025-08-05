export function getPositionPercentByDate(
  date: Date,
  hoursLimit: number,
): number {
  console.log(hoursLimit);
  const nowHours = date.getHours();
  const nowMinutes = date.getMinutes();
  const positionPercent =
    (((nowHours - 8) * 60 + nowMinutes) / ((hoursLimit - 1) * 60)) * 100;
  return positionPercent;
}
