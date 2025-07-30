import { AnimatedSigmaBackground } from '@/shared/ui/AnimatedSigmaBackground ';
import { FeedWidget } from '../widgets/feed';
import { ScheduleWidget } from '@/widgets/schedule';
import { BirthdaysWidget } from '@/widgets/birthdays';
import { useUiConfigStore } from '@/entities/ui-config';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
//import { BackgroundAnimation } from '@/shared/ui/BackgroundAnimation';

const widgetMap: Record<string, React.ReactNode> = {
  feed: <FeedWidget />,
  schedule: <ScheduleWidget />,
  birthdays: <BirthdaysWidget />,
};

export function KioskPage() {
  const { uiConfig } = useUiConfigStore();
  const widgets = uiConfig?.rotatingWidgets ?? [];
  const interval = uiConfig?.autoSwitchIntervalMs ?? 0;
  const [index, setIndex] = useState(0);

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

  const currentWidget = widgetMap[widgets[index]] ?? null;

  return (
    <div className="h-screen w-screen p-4">
      <AnimatedSigmaBackground />
      {/* <BackgroundAnimation /> */}
      <AnimatePresence mode="wait">
        <motion.div
          key={widgets[index]}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.0 }}
          className="h-full w-full"
        >
          {currentWidget}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
