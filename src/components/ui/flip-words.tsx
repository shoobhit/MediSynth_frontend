
"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export const FlipWords = ({ words, className = "" }: { words: string[]; className?: string }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((current) => (current + 1) % words.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [words.length]);

  return (
    <span className="inline-block w-[140px] h-[40px] relative">
      <AnimatePresence mode="wait">
        <motion.span
          key={currentIndex}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.5 }}
          className={`absolute ${className}`}
        >
          {words[currentIndex]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
};
