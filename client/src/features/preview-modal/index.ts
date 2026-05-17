export { PreviewModal } from './ui/PreviewModal';
export { buildMediaDescription } from './lib/buildMediaDescription';

export type PreviewDescription = {
  name?: string;
  format?: string;
  resolution?: string;
  size?: string;
  duration?: string | null;
};
