import "./styles.css";

import { MainContainer } from "@/atoms/hocs/_index";
import { AnimatedTitle } from "@/atoms/texts/_index";
import { TransitionEffect } from "@/molecules/_index";

export const metadata = {
  title: "About",
};

export default function Layout({ children }) {
  const title = "Passion Fuels Purpose!";

  return (
    <>
      <TransitionEffect />
      <main className="main_about">
        <MainContainer className="main-container_about">
          <AnimatedTitle text={title} className="about-title" />
          {children}
        </MainContainer>
      </main>
    </>
  );
}
