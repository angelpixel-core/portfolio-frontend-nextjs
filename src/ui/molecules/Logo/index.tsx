"use client";

import React from "react";

import "./styles.css";

import { default as NextLink } from "next/link";

import LogoIcon from "@/icons/LogoIcon";

const Logo = (): React.JSX.Element => {
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
