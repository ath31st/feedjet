import { motion } from 'framer-motion';
import { FeedCard } from './FeedCard';
import type { FeedItem } from '@/entities/feed';

interface AnimatedFeedCardProps {
  item: FeedItem;
  index: number;
  cellsCount: number;
}

export function AnimatedFeedCard({
  item,
  index,
  cellsCount,
}: AnimatedFeedCardProps) {
  return (
    <motion.div
      className="h-full min-h-0"
      initial={{ opacity: 0, y: -150 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ duration: 0.7, delay: index * 0.1 }}
      layout
    >
      <FeedCard item={item} cellsCount={cellsCount} />
    </motion.div>
  );
}
