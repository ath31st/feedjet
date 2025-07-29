import { motion } from 'framer-motion';
import { FeedCard } from './FeedCard';
import type { FeedItem } from '@/entities/feed';
import { FeedCardFrame } from './FeedCardFrame';

interface AnimatedFeedCardProps {
  item: FeedItem;
  index: number;
  cellsPerPage: number;
}

export function AnimatedFeedCard({
  item,
  index,
  cellsPerPage,
}: AnimatedFeedCardProps) {
  return (
    <motion.div
      className="h-full min-h-0"
      key={item.link}
      initial={{ opacity: 0, x: -150 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.7, delay: index * 0.1 }}
      layout
    >
      <FeedCardFrame key={item.link}>
        <FeedCard item={item} cellsPerPage={cellsPerPage} />
      </FeedCardFrame>
    </motion.div>
  );
}
