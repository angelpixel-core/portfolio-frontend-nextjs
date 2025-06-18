import "./styles.css";

import { TransitionEffect } from "@/molecules";
import { MainContainer } from "@/atoms/hocs";
import { AnimatedTitle } from "@/atoms/texts";

// TODO: Continue here, the menu should render Projects page instead Portfolio
export const metadata = {
  title: "Projects",
};

export default function Layout({ children }) {
  const title = "Imagination Trumps Knowledge!";

  return (
    <>
      <TransitionEffect />

      <main className="main_projects">
        <MainContainer className="main-container_projects">
          <AnimatedTitle text={title} className="projects-title" />
          {children}
        </MainContainer>
      </main>
    </>
  );
}
