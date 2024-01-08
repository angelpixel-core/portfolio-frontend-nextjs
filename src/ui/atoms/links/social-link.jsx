"use client";

import { motion } from "framer-motion";

export const SocialLink = ({
  children,
  href = "#",
  target = "_blank",
  className = "",
}) => {
  return (
    <motion.a
      href={href}
      target={target}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.9 }}
      className={`${className} social-option_title`}
    >
      {children}
    </motion.a>
  );
};
