"use client";

import "./styles.css";

import { motion } from "framer-motion";
import { default as Icon } from "./Icon";
import { useReducedMotion } from "@/hooks";

const SocialNetworkLink = ({ href, iconName, iconClassName, ariaLabel }) => {
  const label = ariaLabel || iconName;
  const shouldReduceMotion = useReducedMotion();
  // Generate testid from iconName: github -> nav-social-github-link
  const testId = `nav-social-${(iconName || "unknown").toLowerCase()}-link`;

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      title={label}
      whileHover={shouldReduceMotion ? undefined : { y: -2 }}
      whileTap={shouldReduceMotion ? undefined : { scale: 0.9 }}
      className="social_link"
      data-testid={testId}
    >
      <Icon name={iconName} className={`social_link-icon ${iconClassName}`} />
    </motion.a>
  );
};

export default SocialNetworkLink;
