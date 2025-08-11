export function useScheduleEnv() {
  return {
    scheduleHeaderTitle: import.meta.env.VITE_SCHEDULE_HEADER_TITLE ?? '',
    scheduleLocationTitle: import.meta.env.VITE_SCHEDULE_LOCATION_TITLE ?? '',
    scheduleLocationLon: import.meta.env.VITE_SCHEDULE_LOCATION_LON ?? '',
    scheduleLocationLat: import.meta.env.VITE_SCHEDULE_LOCATION_LAT ?? '',
  };
}
