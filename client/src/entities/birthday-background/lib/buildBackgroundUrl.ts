import { SERVER_URL } from '@/shared/config';

export const buildBackgroundUrl = (fileName: string) =>
  `${SERVER_URL}/backgrounds/${fileName}`;
