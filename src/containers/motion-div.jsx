"use client";

import { motion } from "framer-motion";

export const MotionDiv = ({ children }) => {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0, x: "-50%", y: "-50%" }}
      animate={{ scale: 1, opacity: 1 }}
      className="menu_container--responsive"
    >
      {children}
    </motion.div>
  );
};
