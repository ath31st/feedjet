import { SERVER_URL } from '@/shared/config';

export const buildImageUrl = (fileName: string) =>
  `${SERVER_URL}/images/${fileName}`;
