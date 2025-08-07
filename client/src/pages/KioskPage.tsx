import { AnimatedSigmaBackground } from '@/shared/ui/AnimatedSigmaBackground ';
import { FeedWidget } from '../widgets/feed';
import { ScheduleWidget } from '@/widgets/schedule';
import { BirthdaysWidget } from '@/widgets/birthdays';
import { useUiConfigStore } from '@/entities/ui-config';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { Rotator } from '@/widgets/feed/Rotator';
import { parseRotateParam } from '@/shared/lib/parseRotateParam';
import { LoadingThreeDotsJumping } from '@/shared/ui/LoadingThreeDotsJumping';
import { parseAnimationParam } from '@/shared/lib/parseAnimationParam';

export function KioskPage() {
  const { uiConfig, loading } = useUiConfigStore();
  const widgets = uiConfig?.rotatingWidgets ?? [];
  const interval = uiConfig?.autoSwitchIntervalMs ?? 0;
  const [index, setIndex] = useState(0);

  const [searchParams] = useSearchParams();
  const rotate = parseRotateParam(searchParams.get('rotate'));
  const animation = parseAnimationParam(searchParams.get('animation'));

  const widgetMap: Record<string, React.ReactNode> = {
    feed: <FeedWidget rotate={rotate} animation={animation} />,
    schedule: <ScheduleWidget />,
    birthdays: <BirthdaysWidget />,
  };

  useEffect(() => {
    if (!interval || widgets.length < 2) return;

    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % widgets.length);
    }, interval);

    return () => clearInterval(id);
  }, [interval, widgets]);

  useEffect(() => {
    if (index >= widgets.length) {
      setIndex(0);
    }
  }, [widgets, index]);

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <LoadingThreeDotsJumping />
      </div>
    );
  }

  const currentWidget = widgetMap[widgets[index]] ?? null;

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
