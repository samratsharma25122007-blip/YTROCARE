"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/**
 * Thin vertical Apple-style progress line pinned to the right edge.
 */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed right-4 top-1/2 z-40 hidden h-40 w-px -translate-y-1/2 md:block"
    >
      <div className="absolute inset-0 rounded-full bg-white/10" />
      <motion.div
        style={{ scaleY, transformOrigin: "top" }}
        className="absolute inset-0 rounded-full bg-gradient-to-b from-cyan-glow to-brand-blue shadow-glow-cyan"
      />
    </div>
  );
}
