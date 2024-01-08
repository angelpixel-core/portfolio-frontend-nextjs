"use client";

import { motion } from "framer-motion";

const quote = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { delay: 0.25 },
    staggerChildren: 0.08,
  },
};

const singleWord = {
  initial: { opacity: 0, y: 50 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 1 },
  },
};

export const AnimatedTitle = ({ text, className = "" }) => {
  return (
    <div className="animated-title_container">
      <motion.h1
        className={`animated-title_text ${className}`}
        variants={quote}
        initial="initial"
        animate="animate"
      >
        {text.split(" ").map((word, index) => (
          <motion.span
            key={`${word}-${index}`}
            className="animated-title_text-word"
            variants={singleWord}
          >
            {word}&nbsp;
          </motion.span>
        ))}
      </motion.h1>
    </div>
  );
};
