import React from "react";
import "./styles.css";

import TransitionEffect from "@/molecules/TransitionEffect";
import { MainContainer } from "@/atoms/hocs";

export const metadata = {
  title: "Articles",
  description:
    "Technical articles and insights about web development, software engineering, and technology.",
  alternates: {
    canonical: "/articles",
  },
};

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps): React.JSX.Element {
  return (
    <>
      <TransitionEffect />

      <main className="main_articles">
        <MainContainer className="main-container_articles">
          {children}
        </MainContainer>
      </main>
    </>
  );
}
