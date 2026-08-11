import { AnimatePresence, motion } from 'framer-motion';
import type { AnimationType } from '@/shared/lib/parseAnimationParam';
import { getKioskSlideMotion } from '@/shared/ui';
import { usePdfItemPlayback } from '../model/usePdfItemPlayback';

interface Props {
  fileName: string;
  durationSeconds: number | null;
  onEnd: () => void;
  animation: AnimationType;
  isPaused?: boolean;
}

export const PdfItemView = ({
  fileName,
  durationSeconds,
  onEnd,
  animation,
  isPaused = false,
}: Props) => {
  const { pageSrc, onPageImageError } = usePdfItemPlayback({
    fileName,
    durationSeconds,
    onEnd,
    isPaused,
  });

  return (
    <div className="fixed inset-0 z-50">
      <AnimatePresence mode="wait">
        {pageSrc ? (
          <motion.img
            key={pageSrc}
            src={pageSrc}
            alt=""
            className="absolute inset-0 z-10 h-full w-full object-contain"
            {...getKioskSlideMotion(animation)}
            onError={onPageImageError}
          />
        ) : null}
      </AnimatePresence>
    </div>
  );
};
