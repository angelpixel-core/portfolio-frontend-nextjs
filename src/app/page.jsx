import "./styles.css";

import { MainContainer } from "@/hoc/_index";
import { AnimatedTitle, Paragraph } from "@/atoms/texts/_index";
import { ArrowButton } from "@/atoms/buttons/_index";
import { BaseLink } from "@/atoms/links/_index";
import { HeroImage, HireMe } from "@/molecules/home/_index";
import { TransitionEffect } from "@/molecules/layout/_index";

export default async function Home() {
  const title = "Turning Vision Into Reality With Code And Design.";
  const mainParagraph =
    "As a skilled full-stack developer, I am dedicated to turning ideas into innovative web applications. Explore my latest projects and articles, showcasing my expertise in React.js and web development.";

  const profile = {
    email: "angel.szymczak@hotmail.com",
    resume: process.env.RESUME_URL,
  };

  return (
    <>
      <TransitionEffect />
      <main className="main_home">
        <MainContainer className="main_home-container">
          <div className="home-container">
            <div className="home-hero_image-container">
              <HeroImage name="hero" size="512" className="home-hero_image" />
            </div>

            <div className="home-content">
              <AnimatedTitle text={title} className="home_title" />

              <Paragraph text={mainParagraph} className="home_slogan" />

              <div className="home_contact-container">
                <ArrowButton text="resume" href={profile.resume} />

                <BaseLink
                  href={`mailto:${profile.email}`}
                  target="_blank"
                  text="contact"
                  className="home_contact-link"
                />
              </div>
            </div>
          </div>
        </MainContainer>

        <HireMe />
      </main>
    </>
  );
}
