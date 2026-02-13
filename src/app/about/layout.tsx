import "./styles.css";

import { MainContainer } from "@/atoms/hocs";
import TransitionEffect from "@/molecules/TransitionEffect";

export const metadata = {
  title: "About",
  description:
    "Learn about my background, skills, and experience as a web developer.",
  alternates: {
    canonical: "/about",
  },
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
