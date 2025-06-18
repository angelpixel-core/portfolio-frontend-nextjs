"use client";

import "./styles.css";

import { motion } from "framer-motion";
import Link from "next/link";

import { LogoIcon } from "@/atoms/icons";

const MotionLink = motion(Link);

export const Logo = () => {
  return (
    <div className="logo">
      <MotionLink
        href="/"
        className="logo-link"
        whileHover={{
          backgroundColor: [
            "#121212",
            "rgba(131,58,180,1)",
            "rgba(253,29,29,1)",
            "rgba(252,176,69,1)",
            "rgba(131,58,180,1)",
            "#121212",
          ],
          transition: { duration: 1, repeat: Infinity },
        }}
      >
        <LogoIcon />
      </MotionLink>
    </div>
  );
};
