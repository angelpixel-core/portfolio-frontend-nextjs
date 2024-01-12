import "./styles.css";

import { TransitionEffect } from "@/molecules/layout/_index";
import { MainContainer } from "@/hoc/_index";
import { AnimatedTitle } from "@/atoms/texts/_index";

export const metadata = {
  title: "Articles",
};

export default function Page({ children }) {
  const title = "Words Can Change The World!";

  return (
    <>
      <TransitionEffect />

      <main className="main_articles">
        <MainContainer className="main-container_articles">
          <AnimatedTitle text={title} className="article-title" />
          {children}
        </MainContainer>
      </main>
    </>
  );
}
