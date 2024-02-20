"use client";

import "./styles.css";

import { motion } from "framer-motion";
import { Icon } from "./icon";

export function SocialLink({ href, iconName, iconClassName }) {
  return (
    <motion.a
      href={href}
      target="_blank"
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.9 }}
      className="social_link"
    >
      <Icon name={iconName} className={`social_link-icon ${iconClassName}`} />
    </motion.a>
  );
}
