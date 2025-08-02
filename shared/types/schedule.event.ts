export interface ScheduleEvent {
  id: string;
  date: string;
  startTime: string;
  endTime?: string;
  title: string;
  description?: string;
}

export type Schedule = ScheduleEvent[];
