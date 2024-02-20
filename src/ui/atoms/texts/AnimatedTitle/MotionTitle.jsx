"use client";

import { motion } from "framer-motion";

export function MotionTitle({ title, className }) {
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

  return (
    <motion.h1
      className={`animated-title ${className}`}
      variants={quote}
      initial="initial"
      animate="animate"
    >
      {title.split(" ").map((word, index) => (
        <motion.span
          key={`${word}-${index}`}
          className="animated-title_word"
          variants={singleWord}
        >
          {word}&nbsp;
        </motion.span>
      ))}
    </motion.h1>
  );
}
