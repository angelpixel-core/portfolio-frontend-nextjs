import "./styles.css";

import TransitionEffect from "@/molecules/TransitionEffect";
import { MainContainer } from "@/atoms/hocs";

export const metadata = {
  title: "Projects",
  description:
    "Explore my portfolio of web development projects, featuring demos, source code, and technical details.",
  alternates: {
    canonical: "/projects",
  },
};

export default function Layout({ children }) {
  return (
    <>
      <TransitionEffect />

      <section className="main_projects">
        <MainContainer className="main-container_projects">
          {children}
        </MainContainer>
      </section>
    </>
  );
}
