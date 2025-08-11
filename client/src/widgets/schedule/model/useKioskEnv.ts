export function useScheduleEnv() {
  return {
    scheduleHeaderTitle: import.meta.env.VITE_SCHEDULE_HEADER_TITLE ?? '',
    scheduleLocationTitle: import.meta.env.VITE_SCHEDULE_LOCATION_TITLE ?? '',
    scheduleLocationCoord: import.meta.env.VITE_SCHEDULE_LOCATION_COORD ?? '',
  };
}
