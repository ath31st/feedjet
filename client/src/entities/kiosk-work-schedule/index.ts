export * from './api/useKioskWorkSchedule';
export * from '@shared/types/kiosk.work.schedule';

export interface DaySchedule {
  dayOfWeek: number;
  isEnabled: boolean;
  startTime: string;
  endTime: string;
}
