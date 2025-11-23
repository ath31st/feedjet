import {
  COMPANY_NAME,
  HEADER_TITLE,
  LAT,
  LOCATION_TITLE,
  LON,
} from '../config';

export function useEnv() {
  const lat = Number(LAT);
  const lon = Number(LON);

  return {
    headerTitle: HEADER_TITLE ?? '',
    locationTitle: LOCATION_TITLE ?? '',
    companyName: COMPANY_NAME ?? '',
    locationLat: Number.isNaN(lat) ? 0 : lat,
    locationLon: Number.isNaN(lon) ? 0 : lon,
  };
}
