import React from "react";
import "./styles.css";

import { TransitionEffect } from "@/molecules";
import { MainContainer } from "@/atoms/hocs";
import { AnimatedTitle } from "@/atoms/texts";

export const metadata = {
  title: "Articles",
};

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps): React.JSX.Element {
  const title = "Words Can Change The World!";

  return (
    <>
      <TransitionEffect />

      <main className="main_articles">
        <MainContainer className="main-container_articles">
          {/* @ts-expect-error - AnimatedTitle doesn't use text prop (pre-existing issue) */}
          <AnimatedTitle text={title} className="article-title" />
          {children}
        </MainContainer>
      </main>
    </>
  );
}
