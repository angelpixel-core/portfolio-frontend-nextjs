"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks";

const MotionTitle = ({ title, className }) => {
  const shouldReduceMotion = useReducedMotion();

  const quote = {
    initial: { opacity: shouldReduceMotion ? 1 : 0 },
    animate: {
      opacity: 1,
      transition: shouldReduceMotion ? { duration: 0 } : { delay: 0.25 },
      staggerChildren: shouldReduceMotion ? 0 : 0.08,
    },
  };

  const singleWord = {
    initial: {
      opacity: shouldReduceMotion ? 1 : 0,
      y: shouldReduceMotion ? 0 : 50,
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: shouldReduceMotion ? 0 : 1 },
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
};

export default MotionTitle;
