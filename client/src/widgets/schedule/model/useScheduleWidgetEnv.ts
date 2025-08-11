export function useScheduleEnv() {
  const lat = Number(import.meta.env.VITE_SCHEDULE_LOCATION_LAT);
  const lon = Number(import.meta.env.VITE_SCHEDULE_LOCATION_LON);

  return {
    scheduleHeaderTitle: import.meta.env.VITE_SCHEDULE_HEADER_TITLE ?? '',
    scheduleLocationTitle: import.meta.env.VITE_SCHEDULE_LOCATION_TITLE ?? '',
    scheduleLocationLat: Number.isNaN(lat) ? 0 : lat,
    scheduleLocationLon: Number.isNaN(lon) ? 0 : lon,
  };
}
