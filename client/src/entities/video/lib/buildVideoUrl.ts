import { SERVER_URL } from '@/shared/config';

export const buildVideoUrl = (fileName: string) =>
  `${SERVER_URL}/video/${fileName}`;
