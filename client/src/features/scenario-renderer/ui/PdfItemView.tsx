import { AnimatePresence, motion } from 'framer-motion';
import { usePdfItemPlayback } from '../model/usePdfItemPlayback';

interface Props {
  fileName: string;
  durationSeconds: number | null;
  onEnd: () => void;
  isPaused?: boolean;
}

const pageMotion = {
  initial: { opacity: 0, scale: 1.04, y: 12 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.97, y: -10 },
  transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
};

export const PdfItemView = ({
  fileName,
  durationSeconds,
  onEnd,
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
            initial={pageMotion.initial}
            animate={pageMotion.animate}
            exit={pageMotion.exit}
            transition={pageMotion.transition}
            style={{ willChange: 'opacity, transform' }}
            onError={onPageImageError}
          />
        ) : null}
      </AnimatePresence>
    </div>
  );
};
