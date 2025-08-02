export interface ScheduleEvent {
  id: number;
  date: string;
  startTime: string;
  endTime?: string | null;
  title: string;
  description?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export type Schedule = ScheduleEvent[];

export interface NewScheduleEvent {
  date: string;
  startTime: string;
  endTime?: string;
  title: string;
  description?: string;
}

export interface UpdateScheduleEvent {
  date?: string;
  startTime?: string;
  endTime?: string;
  title?: string;
  description?: string;
}
