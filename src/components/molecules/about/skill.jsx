"use client";

import { motion } from "framer-motion";

export default function Skill({
  name,
  whileHover = "",
  initial = "",
  whileInView = "",
  viewport = "",
  className = "",
}) {
  return (
    <motion.div
      whileHover={whileHover}
      initial={initial}
      whileInView={whileInView}
      viewport={viewport}
      className={`
        flex items-center justify-center

        rounded-full
        font-semibold  xs:font-bold

        shadow-dark dark:shadow-light

        bg-dark xs:bg-transparent
        dark:bg-light xs:dark:bg-transparent

        text-light xs:text-dark
        dark:text-dark xs:dark:text-light

        md:text-sm xs:text-xs

        cursor-pointer

        ${className}
      `}
    >
      {name}
    </motion.div>
  );
}
