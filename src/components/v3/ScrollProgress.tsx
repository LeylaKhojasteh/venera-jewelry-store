'use client';

import { motion, useScroll, useSpring } from 'motion/react';

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  return (
    <div className="v3-progress-track" aria-hidden="true">
      <motion.div className="v3-progress" style={{ scaleX }} />
    </div>
  );
}
