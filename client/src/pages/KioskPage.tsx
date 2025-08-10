import { AnimatedSigmaBackground } from '@/shared/ui/AnimatedSigmaBackground ';
import { FeedWidget } from '../widgets/feed';
import { ScheduleWidget } from '@/widgets/schedule';
import { BirthdaysWidget } from '@/widgets/birthdays';
import { useUiConfigStore } from '@/entities/ui-config';
import { AnimatePresence, motion } from 'framer-motion';
import { Rotator } from '@/shared/ui/Rotator';
import { LoadingThreeDotsJumping } from '@/shared/ui/LoadingThreeDotsJumping';
import { useKioskParams } from '@/features/kiosk-params';
import { useKioskRotation } from '@/features/kiosk-rotation';

export function KioskPage() {
  const { uiConfig, loading } = useUiConfigStore();
  const widgets = uiConfig?.rotatingWidgets ?? [];
  const interval = uiConfig?.autoSwitchIntervalMs ?? 0;

  const { rotate, animation } = useKioskParams();
  const { index } = useKioskRotation({ widgets, interval });

  const widgetMap: Record<string, React.ReactNode> = {
    feed: <FeedWidget rotate={rotate} animation={animation} />,
    schedule: <ScheduleWidget rotate={rotate} />,
    birthdays: <BirthdaysWidget />,
  };

  const currentWidget = widgetMap[widgets[index]] ?? null;

  if (loading) {
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
          key={widgets[index]}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.0 }}
        >
          <Rotator rotate={rotate}>
            <AnimatedSigmaBackground />
            {currentWidget}
          </Rotator>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
