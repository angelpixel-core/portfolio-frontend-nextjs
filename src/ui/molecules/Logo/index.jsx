"use client";

import "./styles.css";

import { motion } from "framer-motion";
import { default as NextLink } from "next/link";

import LogoIcon from "@/icons/LogoIcon";
import { useReducedMotion } from "@/hooks";

const MotionLink = motion(NextLink);

const Logo = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="logo">
      <MotionLink
        href="/"
        className="logo-link"
        aria-label="Go to home"
        title="Go to home"
        whileHover={
          shouldReduceMotion
            ? undefined
            : {
                backgroundColor: [
                  "#121212",
                  "rgba(131,58,180,1)",
                  "rgba(253,29,29,1)",
                  "rgba(252,176,69,1)",
                  "rgba(131,58,180,1)",
                  "#121212",
                ],
                transition: { duration: 1, repeat: Infinity },
              }
        }
      >
        <LogoIcon />
      </MotionLink>
    </div>
  );
};

export default Logo;
