import { motion, useScroll, useSpring } from "framer-motion";

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 150,
    damping: 25,
    mass: 0.2
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-[999] h-[3px] origin-left bg-gradient-to-r from-teal-300/80 via-white/40 to-indigo-300/70"
      style={{ scaleX }}
    />
  );
}
