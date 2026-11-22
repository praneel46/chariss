import React from 'react';
import { motion } from 'framer-motion';

interface CurtainTransitionProps {
  children: React.ReactNode;
}

export const CurtainTransition: React.FC<CurtainTransitionProps> = ({ children }) => {
  const isReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (isReducedMotion) {
    return <>{children}</>;
  }

  return (
    <div className="relative w-full">
      {/* Primary Left Obsidian Panel */}
      <motion.div
        className="fixed top-0 left-0 w-1/2 h-full z-[9999] bg-[#141110] pointer-events-none"
        initial={{ x: 0 }}
        animate={{ x: '-100%' }}
        exit={{ x: 0 }}
        transition={{ duration: 0.85, ease: [0.76, 0, 0.24, 1] }}
      />

      {/* Primary Right Obsidian Panel */}
      <motion.div
        className="fixed top-0 right-0 w-1/2 h-full z-[9999] bg-[#141110] pointer-events-none"
        initial={{ x: 0 }}
        animate={{ x: '100%' }}
        exit={{ x: 0 }}
        transition={{ duration: 0.85, ease: [0.76, 0, 0.24, 1] }}
      />

      {/* Secondary Left Flame Accent Panel */}
      <motion.div
        className="fixed top-0 left-0 w-1/2 h-full z-[9998] bg-[#ef4a23] pointer-events-none"
        initial={{ x: 0 }}
        animate={{ x: '-100%' }}
        exit={{ x: 0 }}
        transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1], delay: 0.08 }}
      />

      {/* Secondary Right Flame Accent Panel */}
      <motion.div
        className="fixed top-0 right-0 w-1/2 h-full z-[9998] bg-[#ef4a23] pointer-events-none"
        initial={{ x: 0 }}
        animate={{ x: '100%' }}
        exit={{ x: 0 }}
        transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1], delay: 0.08 }}
      />

      {/* Center Hairline Vertical Divider */}
      <motion.div
        className="fixed top-0 left-1/2 w-[2px] h-full z-[10001] bg-[#faf3e4]/30 -translate-x-1/2 pointer-events-none"
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0 }}
        exit={{ scaleY: 1 }}
        transition={{ duration: 0.45, ease: [0.76, 0, 0.24, 1], delay: 0.15 }}
        style={{ originY: 0.5 }}
      />

      {/* Center CHARIS Brand Wordmark Badge */}
      <motion.div
        className="fixed inset-0 z-[10000] flex items-center justify-center pointer-events-none"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        exit={{ opacity: 1 }}
        transition={{ duration: 0.35, delay: 0.4 }}
      >
        <motion.span
          className="font-yellowtail text-6xl sm:text-8xl md:text-9xl text-[#faf3e4] -rotate-6 select-none drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{
            scale: 1,
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: 0.75,
            ease: [0.22, 1, 0.36, 1],
            delay: 0.05,
            opacity: { duration: 0.75, times: [0, 0.3, 0.65, 1] },
          }}
        >
          charis.
        </motion.span>
      </motion.div>

      {/* Page Content Fade & Slide in */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4, delay: 0.45, ease: 'easeOut' }}
      >
        {children}
      </motion.div>
    </div>
  );
};

export default CurtainTransition;
