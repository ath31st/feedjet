import { Suspense } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  SeasonOverlay,
  StaticBackground,
  Rotator,
  LoadingThreeDotsJumping,
} from '@/shared/ui';
import { useKioskParams } from '@/features/kiosk-params';
import { useScenarioRotation } from '@/features/kiosk-rotation';
import { ScenarioItemRenderer } from '@/features/scenario-renderer';
import { TickerRuntime } from '@/widgets/ticker-runtime';
import { useIframeBridge } from '@/features/kiosk-iframe-bridge';

export function KioskPage() {
  const { rotate, animation } = useKioskParams();
  const {
    scenarioLoading,
    currentItem,
    index,
    unlockRotation,
    next,
    prev,
    togglePause,
    userPaused,
  } = useScenarioRotation();

  useIframeBridge({
    onNext: next,
    onPrev: prev,
    onTogglePause: togglePause,
    userPaused,
    currentItemId: currentItem?.id ?? null,
    currentIndex: index,
  });

  if (scenarioLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <LoadingThreeDotsJumping />
      </div>
    );
  }

  if (!currentItem) {
    return (
      <div className="relative h-screen w-screen">
        <Rotator rotate={rotate}>
          <StaticBackground />
          <div className="flex h-screen w-screen items-center justify-center text-(--text-muted)">
            <p className="text-2xl">Сценарий пуст</p>
          </div>
        </Rotator>
      </div>
    );
  }

  const itemKey = `${currentItem.id}-${currentItem.type}`;

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          //           key={currentWidgetKey}
          //           initial={{ opacity: 0 }}
          //           animate={{ opacity: 1 }}
          //           exit={{ opacity: 0 }}
          //           transition={{ duration: 1.0 }}
          key={itemKey}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.04, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97, y: -10 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          style={{ willChange: 'opacity, transform' }}
        >
          <Rotator rotate={rotate}>
            <SeasonOverlay />
            <StaticBackground />
            <Suspense fallback={null}>
              <ScenarioItemRenderer
                item={currentItem}
                rotate={rotate}
                animation={animation}
                onVideoEnd={unlockRotation}
              />
            </Suspense>
          </Rotator>
        </motion.div>
      </AnimatePresence>

      <Rotator rotate={rotate}>
        <TickerRuntime rotate={rotate} />
      </Rotator>
    </div>
  );
}
