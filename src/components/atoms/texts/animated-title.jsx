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

export default function AnimatedTitle({ text, className = "" }) {
  return (
    <div
      className="
        flex items-center justify-center
        w-full
        mx-auto
        py-2 sm:py-0
        text-center
        overflow-hidden
      "
    >
      <motion.h1
        className={`
          inline-block
          w-full
          capitalize
          font-bold
          text-8xl
          text-dark dark:text-light
          ${className}
        `}
        variants={quote}
        initial="initial"
        animate="animate"
      >
        {text.split(" ").map((word, index) => (
          <motion.span
            key={word + `-` + index}
            className="inline-block"
            variants={singleWord}
          >
            {word}&nbsp;
          </motion.span>
        ))}
      </motion.h1>
    </div>
  );
}
