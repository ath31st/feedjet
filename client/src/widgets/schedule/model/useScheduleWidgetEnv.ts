import { HEADER_TITLE, LAT, LOCATION_TITLE, LON } from '@/shared/config/env';

export function useScheduleEnv() {
  const lat = Number(LAT);
  const lon = Number(LON);

  return {
    scheduleHeaderTitle: HEADER_TITLE ?? '',
    scheduleLocationTitle: LOCATION_TITLE ?? '',
    scheduleLocationLat: Number.isNaN(lat) ? 0 : lat,
    scheduleLocationLon: Number.isNaN(lon) ? 0 : lon,
  };
}
