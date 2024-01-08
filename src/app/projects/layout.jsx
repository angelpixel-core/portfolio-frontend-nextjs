import { TransitionEffect } from "@/molecules/layout/_index";
import { MainContainer } from "@/hoc/_index";
import { AnimatedTitle } from "@/atoms/texts/_index";

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
