import { lazy, Suspense } from 'react';
import { AnimatedSigmaBackground, StaticBackground } from '@/shared/ui';
import { useUiConfigStore } from '@/entities/ui-config';
import { Rotator } from '@/shared/ui/Rotator';
import { LoadingThreeDotsJumping } from '@/shared/ui';
import { useKioskParams } from '@/features/kiosk-params';
import { useKioskRotation } from '@/features/kiosk-rotation';
import { AnimatePresence, motion } from 'framer-motion';

const FeedWidget = lazy(() => import('@/widgets/feed'));
const ScheduleWidget = lazy(() => import('@/widgets/schedule'));
const VideoPlayerWidget = lazy(() => import('@/widgets/video-player'));
const BirthdayWidget = lazy(() => import('@/widgets/birthday'));
const InfoWidget = lazy(() => import('@/widgets/info'));

export function KioskPage() {
  const { uiConfig, loading, initialized } = useUiConfigStore();
  const widgets = uiConfig?.rotatingWidgets ?? [];
  const interval = uiConfig?.autoSwitchIntervalMs ?? 0;
  const { rotate, animation } = useKioskParams();
  const { index } = useKioskRotation({ widgets, interval });
  const currentWidgetKey = widgets[index];

  if (loading || !initialized) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <LoadingThreeDotsJumping />
      </div>
    );
  }

  return (
    <div className="h-screen w-screen">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentWidgetKey}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.0 }}
        >
          <Rotator rotate={rotate}>
            {animation === 'full' ? (
              <AnimatedSigmaBackground />
            ) : (
              <StaticBackground />
            )}

            <Suspense fallback={null}>
              {currentWidgetKey === 'feed' && (
                <FeedWidget rotate={rotate} animation={animation} />
              )}
              {currentWidgetKey === 'schedule' && (
                <ScheduleWidget rotate={rotate} />
              )}
              {currentWidgetKey === 'video' && <VideoPlayerWidget />}
              {currentWidgetKey === 'birthday' && (
                <BirthdayWidget rotate={rotate} animation={animation} />
              )}
              {currentWidgetKey === 'info' && <InfoWidget rotate={rotate} />}
            </Suspense>
          </Rotator>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
