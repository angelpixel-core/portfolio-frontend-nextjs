"use client";

import "./styles.css";

import { default as NextLink } from "next/link";

import LogoIcon from "@/icons/LogoIcon";

const Logo = () => {
  return (
    <div className="logo">
      <NextLink
        href="/"
        className="logo-link"
        aria-label="Go to home"
        title="Go to home"
      >
        <LogoIcon />
      </NextLink>
    </div>
  );
};

export default Logo;
