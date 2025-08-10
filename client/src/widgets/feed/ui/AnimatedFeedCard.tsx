import { motion } from 'framer-motion';
import { FeedCard } from './FeedCard';
import type { FeedItem } from '@/entities/feed';
import {
  isLiteAnimation,
  type AnimationType,
} from '@/shared/lib/parseAnimationParam';

interface AnimatedFeedCardProps {
  item: FeedItem;
  index: number;
  cellsCount: number;
  animation: AnimationType;
}

export function AnimatedFeedCard({
  item,
  index,
  cellsCount,
  animation,
}: AnimatedFeedCardProps) {
  const motionProps = isLiteAnimation(animation)
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { duration: 1.1, delay: index * 0.1 },
      }
    : {
        initial: { opacity: 0, y: -150 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.7, delay: index * 0.1 },
        layout: true,
      };

  return (
    <motion.div {...motionProps} className="h-full min-h-0">
      <FeedCard item={item} cellsCount={cellsCount} />
    </motion.div>
  );
}
