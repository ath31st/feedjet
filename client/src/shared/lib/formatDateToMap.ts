import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

export function formatDateToMap(date: Date): {
  dayMonth: string;
  weekDay: string;
} {
  return {
    dayMonth: format(date, 'd MMMM', { locale: ru }),
    weekDay: format(date, 'EEEE', { locale: ru }),
  };
}
