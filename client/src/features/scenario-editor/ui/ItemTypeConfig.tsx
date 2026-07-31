import type { ScenarioItem } from '@/entities/scenario';
import { WIDGET_LABELS } from '@/entities/scenario';
import { buildImageUrl } from '@/entities/image';
import { buildPdfUrl } from '@/entities/pdf';
import { buildVideoUrl } from '@/entities/video';
import {
  Video,
  AlertCircle,
  FileText,
  Image as ImageIcon,
  type LucideIcon,
} from 'lucide-react';

export interface TypeConfig {
  getLabel: (item: ScenarioItem) => string;
  getTypeName: string;
  Icon: LucideIcon;
  hasDuration: boolean;
  canPreview: boolean;
  renderPreview?: (item: ScenarioItem) => React.ReactNode;
}

export const ITEM_CONFIG: Record<string, TypeConfig> = {
  widget: {
    getLabel: (item) =>
      (item.widgetType && WIDGET_LABELS[item.widgetType]) ||
      'Неизвестный виджет',
    getTypeName: 'Виджет',
    Icon: AlertCircle,
    hasDuration: true,
    canPreview: false,
  },
  image: {
    getLabel: (item) => item.imageName ?? 'Изображение',
    getTypeName: 'Изображение',
    Icon: ImageIcon,
    hasDuration: true,
    canPreview: true,
    renderPreview: (item) =>
      item.imageThumbnail ? (
        <img
          src={buildImageUrl(item.imageThumbnail)}
          alt=""
          className="h-full w-full object-cover"
        />
      ) : null,
  },
  video: {
    getLabel: (item) => item.videoName ?? 'Видео',
    getTypeName: 'Видео',
    Icon: Video,
    hasDuration: false,
    canPreview: true,
    renderPreview: (item) =>
      item.videoThumbnail ? (
        <img
          src={buildVideoUrl(item.videoThumbnail)}
          alt=""
          className="h-full w-full object-cover"
        />
      ) : null,
  },
  pdf: {
    getLabel: (item) => {
      const name = item.pdfName ?? 'PDF';
      const pages = item.pdfPageCount;
      return pages != null ? `${name} (${pages} стр.)` : name;
    },
    getTypeName: 'PDF',
    Icon: FileText,
    hasDuration: true,
    canPreview: true,
    renderPreview: (item) =>
      item.pdfThumbnail ? (
        <img
          src={buildPdfUrl(item.pdfThumbnail)}
          alt=""
          className="h-full w-full object-cover"
        />
      ) : null,
  },
};
