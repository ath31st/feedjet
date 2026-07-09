import { SERVER_URL } from '@/shared/config';

export const buildLogoUrl = (fileName: string) =>
  `${SERVER_URL}/logos/${fileName}`;
