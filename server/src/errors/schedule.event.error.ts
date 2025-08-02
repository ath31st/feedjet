export class ScheduleEventError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ScheduleEventError';
  }
}
