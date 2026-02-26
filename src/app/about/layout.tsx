import React from "react";
import type { Metadata } from "next";

import "./styles.css";

import { MainContainer } from "@/atoms/hocs";
import TransitionEffect from "@/molecules/TransitionEffect";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about my background, skills, and experience as a web developer.",
  alternates: {
    canonical: "/about",
  },
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <>
      <TransitionEffect />
      <section className="main__about">
        <MainContainer className="main-container__about">
          {children}
        </MainContainer>
      </section>
    </>
  );
}
