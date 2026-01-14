"use client";

import "./styles.css";

import { motion } from "framer-motion";
import { default as Icon } from "./Icon";

const SocialNetworkLink = ({ href, iconName, iconClassName, ariaLabel }) => {
  const label = ariaLabel || iconName;

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      title={label}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.9 }}
      className="social_link"
    >
      <Icon name={iconName} className={`social_link-icon ${iconClassName}`} />
    </motion.a>
  );
};

export default SocialNetworkLink;
