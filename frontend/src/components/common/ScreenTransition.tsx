/**
 * KaalNetra — Screen Transition Component (Framer Motion)
 *
 * Implements Phase 6 UI Transitions:
 *   - Subtle, restrained cinematic fade and slight translation
 *   - Non-distracting, smooth 250ms duration
 *   - Preserves high readability and responsiveness
 */

import { type ReactNode } from 'react';
import { motion } from 'framer-motion';

interface ScreenTransitionProps {
  children: ReactNode;
  className?: string;
  stageKey?: string;
}

export default function ScreenTransition({
  children,
  className = '',
  stageKey,
}: ScreenTransitionProps) {
  return (
    <motion.div
      key={stageKey}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className={`screen-transition-container w-full ${className}`}
    >
      {children}
    </motion.div>
  );
}
