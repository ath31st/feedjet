import { motion } from 'framer-motion';
import { FeedCard } from './FeedCard';
import type { FeedItem } from '@/entities/feed';
import type { AnimationType } from '@/shared/lib/parseAnimationParam';
import { getFeedCardMotion } from '@/shared/ui';

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
  return (
    <motion.div
      {...getFeedCardMotion(animation, index)}
      className="h-full min-h-0"
    >
      <FeedCard item={item} cellsCount={cellsCount} />
    </motion.div>
  );
}
