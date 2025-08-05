export function getPositionPercentByDateTime(
  time: string | Date,
  startHour: number,
  hoursLimit: number,
): number {
  let hours: number;
  let minutes: number;

  if (typeof time === 'string') {
    [hours, minutes] = time.split(':').map(Number);
  } else {
    hours = time.getHours();
    minutes = time.getMinutes();
  }

  const totalMinutes = (hours - startHour) * 60 + minutes;
  const totalRangeMinutes = hoursLimit * 60;
  return (totalMinutes / totalRangeMinutes) * 100;
}
