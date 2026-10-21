import React from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

export const NavigationProgress: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#F7C8D9] via-[#D982A5] to-[#75445C] origin-left z-50 pointer-events-none"
      style={{ scaleX }}
    />
  );
};
