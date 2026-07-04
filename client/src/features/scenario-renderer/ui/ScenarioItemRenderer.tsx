import { lazy } from 'react';
import type { ScenarioItem, ScenarioWidgetType } from '@/entities/scenario';
import type { AnimationType } from '@/shared/lib';
import { ImageItemView } from './ImageItemView';
import { VideoItemView } from './VideoItemView';

const FeedWidget = lazy(() => import('@/widgets/feed'));
const ScheduleWidget = lazy(() => import('@/widgets/schedule'));
const BirthdayWidget = lazy(() => import('@/widgets/birthday'));
const InfoWidget = lazy(() => import('@/widgets/info'));

interface ScenarioWidgetViewProps {
  widgetType: ScenarioWidgetType;
  rotate: number;
  animation: AnimationType;
}

const ScenarioWidgetView = ({
  widgetType,
  rotate,
  animation,
}: ScenarioWidgetViewProps) => {
  const widgetMap = {
    rss: <FeedWidget rotate={rotate} animation={animation} />,
    schedule: <ScheduleWidget rotate={rotate} />,
    birthday: <BirthdayWidget rotate={rotate} />,
    info: <InfoWidget rotate={rotate} />,
  };

  return widgetMap[widgetType] || null;
};

interface ScenarioItemRendererProps {
  item: ScenarioItem;
  rotate: number;
  animation: AnimationType;
  onVideoEnd: () => void;
  isPreview?: boolean;
}

export const ScenarioItemRenderer = ({
  item,
  rotate,
  animation,
  onVideoEnd,
  isPreview,
}: ScenarioItemRendererProps) => {
  if (item.type === 'widget' && item.widgetType) {
    return (
      <ScenarioWidgetView
        widgetType={item.widgetType}
        rotate={rotate}
        animation={animation}
      />
    );
  }

  if (item.type === 'image' && item.imageFileName) {
    return <ImageItemView fileName={item.imageFileName} />;
  }

  if (item.type === 'video' && item.videoFileName) {
    return (
      <VideoItemView
        fileName={item.videoFileName}
        onEnd={onVideoEnd}
        isPreview={isPreview}
      />
    );
  }

  return null;
};
