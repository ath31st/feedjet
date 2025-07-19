import { motion, type Variants } from 'framer-motion';

export function LoadingThreeDotsJumping() {
  const dotVariants: Variants = {
    jump: {
      y: -30,
      transition: {
        duration: 0.8,
        repeat: Infinity,
        repeatType: 'mirror',
        ease: 'easeInOut',
      },
    },
  };

  return (
    <motion.div
      animate="jump"
      transition={{ staggerChildren: -0.2, staggerDirection: -1 }}
      className="flex h-full items-center justify-center 4k:gap-4 gap-2 overflow-hidden"
    >
      <motion.div
        className="4k:h-15 h-5 4k:w-15 w-5 rounded-full bg-[var(--border)]"
        variants={dotVariants}
      />
      <motion.div
        className="4k:h-15 h-5 4k:w-15 w-5 rounded-full bg-[var(--border)]"
        variants={dotVariants}
      />
      <motion.div
        className="4k:h-15 h-5 4k:w-15 w-5 rounded-full bg-[var(--border)]"
        variants={dotVariants}
      />
    </motion.div>
  );
}
