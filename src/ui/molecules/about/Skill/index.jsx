"use client";

import "./styles.css";

import { motion } from "framer-motion";

export const Skill = ({
  name,
  whileHover = "",
  initial = "",
  whileInView = "",
  viewport = "",
  className = "",
}) => {
  return (
    <motion.div
      whileHover={whileHover}
      initial={initial}
      whileInView={whileInView}
      viewport={viewport}
      className={`skill ${className}`}
    >
      {name}
    </motion.div>
  );
};
