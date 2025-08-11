import { useState } from 'react';
import { addWeeks, startOfWeek } from 'date-fns';

export function useWeekSelector() {
  const todayWeek = startOfWeek(new Date(), { weekStartsOn: 1 });
  const prevWeek = addWeeks(todayWeek, -1);
  const nextWeek = addWeeks(todayWeek, 1);

  const weeks = [
    { label: 'Предыдущая', date: prevWeek, key: 'prev' },
    { label: 'Текущая', date: todayWeek, key: 'current' },
    { label: 'Следующая', date: nextWeek, key: 'next' },
  ];

  const [weekStart, setWeekStart] = useState(todayWeek);

  return { weeks, weekStart, setWeekStart };
}
