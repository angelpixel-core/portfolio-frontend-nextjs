"use client";

import "./styles.css";

import { motion } from "framer-motion";

import {
  DribbbleIcon,
  GithubIcon,
  LinkedInIcon,
  PinterestIcon,
  TelegramIcon,
  TwitterIcon,
} from "@/atoms/icons/_index";

const iconMapping = {
  dribbble: DribbbleIcon,
  github: GithubIcon,
  linkedin: LinkedInIcon,
  pinterest: PinterestIcon,
  telegram: TelegramIcon,
  twitter: TwitterIcon,
};

const Icon = ({ name }) => {
  const IconComponent = iconMapping[name];

  return <IconComponent />;
};

export const SocialLink = ({
  href,
  className = "",
  iconName,
  iconClassName = "",
}) => {
  return (
    <motion.a
      href={href}
      target="_blank"
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.9 }}
      className={`${className} social-option_title`}
    >
      <Icon name={iconName} className={iconClassName} />
    </motion.a>
  );
};
