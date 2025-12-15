export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface KioskWorkSchedule {
  kioskId: number;
  dayOfWeek: DayOfWeek;
  isEnabled: boolean;
  startTime: string;
  endTime: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UpdateKioskWorkSchedule {
  dayOfWeek: DayOfWeek;
  isEnabled: boolean;
  startTime: string;
  endTime: string;
}
