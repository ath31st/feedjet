import { startOfWeek, addDays } from 'date-fns';

export function getDaysOfWeekByDate(date: Date): Date[] {
  const weekStart = startOfWeek(date, { weekStartsOn: 1 });

  const daysOfWeek: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const day = addDays(weekStart, i);
    daysOfWeek.push(day);
  }

  return daysOfWeek;
}
