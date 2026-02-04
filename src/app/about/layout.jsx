import "./styles.css";

import { MainContainer } from "@/atoms/hocs";
import { TransitionEffect } from "@/molecules";

export const metadata = {
  title: "About",
};

export default function Layout({ children }) {
  return (
    <>
      <TransitionEffect />
      <section className="main_about">
        <MainContainer className="main-container_about">
          {children}
        </MainContainer>
      </section>
    </>
  );
}
