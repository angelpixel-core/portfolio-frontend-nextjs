"use client";

import React from "react";

import "./styles.css";

import { default as NextLink } from "next/link";

import LogoCube from "@/molecules/LogoCube";

const DESKTOP_LOGO_FACES = {
  front: "A",
  back: "P",
  top: "I",
  bottom: "X",
  left: "E",
  right: "L",
} as const;

const Logo = (): React.JSX.Element => {
  return (
    <div className="logo">
      <NextLink
        href="/"
        className="logo-link"
        aria-label="Go to home"
        title="Go to home"
      >
        <LogoCube
          className="logo-link__cube"
          faces={DESKTOP_LOGO_FACES}
          size={37}
        />
      </NextLink>
    </div>
  );
};

export default Logo;
