import "./styles.css";

import { TransitionEffect } from "@/molecules";
import { MainContainer } from "@/atoms/hocs";
import { AnimatedTitle } from "@/atoms/texts";

export const metadata = {
  title: "Articles",
};

export default function Layout({ children }) {
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
