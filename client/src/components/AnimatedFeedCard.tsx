import { motion } from 'framer-motion';
import { FeedCard } from './FeedCard';
import type { FeedItem } from '@shared/types/feed';

interface AnimatedFeedCardProps {
  item: FeedItem;
  index: number;
}

export function AnimatedFeedCard({ item, index }: AnimatedFeedCardProps) {
  return (
    <motion.div
      key={item.link}
      initial={{ opacity: 0, x: -150 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.7, delay: index * 0.1 }}
      layout
    >
      <FeedCard item={item} />
    </motion.div>
  );
}
