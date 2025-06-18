import "./styles.css";

import { MainContainer } from "@/atoms/hocs";
import { AnimatedTitle } from "@/atoms/texts";
import { TransitionEffect } from "@/molecules";

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
