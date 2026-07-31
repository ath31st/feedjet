import { SERVER_URL } from '@/shared/config';

export const buildPdfUrl = (fileName: string) =>
  `${SERVER_URL}/pdfs/${fileName}`;
