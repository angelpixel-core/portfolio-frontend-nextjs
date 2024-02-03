"use client";

import "./styles.css";

import { motion } from "framer-motion";

import {
  DribbbleIcon,
  GitHubIcon,
  LinkedInIcon,
  PinterestIcon,
  TelegramIcon,
  TwitterIcon,
} from "@/atoms/icons/_index";

const iconMapping = {
  dribbble: DribbbleIcon,
  github: GitHubIcon,
  linkedin: LinkedInIcon,
  pinterest: PinterestIcon,
  telegram: TelegramIcon,
  twitter: TwitterIcon,
};

const Icon = ({ name, className }) => {
  const IconComponent = iconMapping[name];

  return <IconComponent className={className} />;
};

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
