import { startOfWeek, addDays } from 'date-fns';

export function getCurrentDaysOfWeekWithDate(): Date[] {
  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 1 });

  const daysOfWeek: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const day = addDays(weekStart, i);
    daysOfWeek.push(day);
  }

  return daysOfWeek;
}
